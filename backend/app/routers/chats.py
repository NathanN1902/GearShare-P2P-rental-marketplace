from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload
from app.schemas.chat import ChatCreate, ChatResponse, ChatWithDetails, ChatList
from app.models.chat import Chat
from app.models.user import User
from app.models.message import Message
from app.core.database import get_db
from typing import List

chatRouter = APIRouter()

@chatRouter.post("/", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(chat_data: ChatCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new chat between renter and lender for a booking.
    """
    # Check if chat already exists for this booking
    result = await db.execute(
        select(Chat).where(Chat.booking_id == chat_data.booking_id)
    )
    existing_chat = result.scalar_one_or_none()

    if existing_chat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat already exists for this booking"
        )

    # Verify users exist
    renter_result = await db.execute(select(User).where(User.id == chat_data.renter_id))
    renter = renter_result.scalar_one_or_none()

    lender_result = await db.execute(select(User).where(User.id == chat_data.lender_id))
    lender = lender_result.scalar_one_or_none()

    if not renter or not lender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Renter or lender not found"
        )

    # Create new chat
    new_chat = Chat(
        booking_id=chat_data.booking_id,
        renter_id=chat_data.renter_id,
        lender_id=chat_data.lender_id
    )

    db.add(new_chat)
    await db.commit()
    await db.refresh(new_chat)

    return new_chat


@chatRouter.get("/", response_model=List[ChatList])
async def get_user_chats(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get all chats for a specific user (either as renter or lender).
    """
    # Get all chats where user is either renter or lender
    result = await db.execute(
        select(Chat).where(
            or_(Chat.renter_id == user_id, Chat.lender_id == user_id)
        )
    )
    chats = result.scalars().all()

    chat_list = []

    for chat in chats:
        # Determine the other user
        other_user_id = chat.lender_id if chat.renter_id == user_id else chat.renter_id

        # Get other user details
        user_result = await db.execute(select(User).where(User.id == other_user_id))
        other_user = user_result.scalar_one_or_none()

        # Get last message
        message_result = await db.execute(
            select(Message)
            .where(Message.chat_id == chat.id)
            .order_by(Message.timestamp.desc())
            .limit(1)
        )
        last_message = message_result.scalar_one_or_none()

        # Count unread messages (messages sent by other user)
        unread_result = await db.execute(
            select(Message)
            .where(
                and_(
                    Message.chat_id == chat.id,
                    Message.sender_id == other_user_id
                )
            )
        )
        unread_count = len(unread_result.scalars().all())

        chat_list.append(ChatList(
            id=chat.id,
            booking_id=chat.booking_id,
            other_user={
                "id": other_user.id,
                "first_name": other_user.first_name,
                "last_name": other_user.last_name,
                "full_name": other_user.full_name
            } if other_user else None,
            last_message={
                "content": last_message.content,
                "timestamp": last_message.timestamp,
                "sender_id": last_message.sender_id
            } if last_message else None,
            unread_count=unread_count
        ))

    return chat_list


@chatRouter.get("/{chat_id}", response_model=ChatWithDetails)
async def get_chat(chat_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a specific chat with all its details and messages.
    Only accessible to participants of the chat.
    """
    # Get chat
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Verify user is a participant
    if user_id not in [chat.renter_id, chat.lender_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat"
        )

    # Get renter details
    renter_result = await db.execute(select(User).where(User.id == chat.renter_id))
    renter = renter_result.scalar_one_or_none()

    # Get lender details
    lender_result = await db.execute(select(User).where(User.id == chat.lender_id))
    lender = lender_result.scalar_one_or_none()

    # Get all messages
    messages_result = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.timestamp.asc())
    )
    messages = messages_result.scalars().all()

    return ChatWithDetails(
        id=chat.id,
        booking_id=chat.booking_id,
        renter_id=chat.renter_id,
        lender_id=chat.lender_id,
        renter={
            "id": renter.id,
            "first_name": renter.first_name,
            "last_name": renter.last_name,
            "full_name": renter.full_name
        } if renter else None,
        lender={
            "id": lender.id,
            "first_name": lender.first_name,
            "last_name": lender.last_name,
            "full_name": lender.full_name
        } if lender else None,
        messages=[{
            "id": msg.id,
            "content": msg.content,
            "timestamp": msg.timestamp,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id
        } for msg in messages]
    )


@chatRouter.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a chat and all its messages.
    Only accessible to participants of the chat.
    """
    # Get chat
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Verify user is a participant
    if user_id not in [chat.renter_id, chat.lender_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat"
        )

    # Delete all messages first
    await db.execute(
        select(Message).where(Message.chat_id == chat_id)
    )

    # Delete chat
    await db.delete(chat)
    await db.commit()

    return None
