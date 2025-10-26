from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.schemas.message import MessageCreate, MessageResponse, MessageUpdate, MessageWithDetails
from app.models.message import Message
from app.models.chat import Chat
from app.models.user import User
from app.core.database import get_db
from datetime import datetime
from typing import List

messageRouter = APIRouter()

@messageRouter.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(message_data: MessageCreate, db: AsyncSession = Depends(get_db)):
    """
    Send a new message in a chat.
    """
    # Verify chat exists
    chat_result = await db.execute(select(Chat).where(Chat.id == message_data.chat_id))
    chat = chat_result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Verify sender is a participant in the chat
    if message_data.sender_id not in [chat.renter_id, chat.lender_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat"
        )

    # Verify receiver is the other participant
    expected_receiver = chat.lender_id if message_data.sender_id == chat.renter_id else chat.renter_id
    if message_data.receiver_id != expected_receiver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid receiver for this chat"
        )

    # Create new message
    new_message = Message(
        content=message_data.content,
        timestamp=datetime.utcnow(),
        chat_id=message_data.chat_id,
        sender_id=message_data.sender_id,
        receiver_id=message_data.receiver_id
    )

    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    return new_message


@messageRouter.get("/chat/{chat_id}", response_model=List[MessageWithDetails])
async def get_chat_messages(
    chat_id: int,
    user_id: int,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """
    Get messages for a specific chat with pagination.
    Only accessible to participants of the chat.
    """
    # Verify chat exists
    chat_result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = chat_result.scalar_one_or_none()

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

    # Get messages with pagination
    messages_result = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.timestamp.asc())
        .offset(offset)
        .limit(limit)
    )
    messages = messages_result.scalars().all()

    # Populate message details
    message_list = []
    for msg in messages:
        # Get sender details
        sender_result = await db.execute(select(User).where(User.id == msg.sender_id))
        sender = sender_result.scalar_one_or_none()

        # Get receiver details
        receiver_result = await db.execute(select(User).where(User.id == msg.receiver_id))
        receiver = receiver_result.scalar_one_or_none()

        message_list.append(MessageWithDetails(
            id=msg.id,
            content=msg.content,
            timestamp=msg.timestamp,
            chat_id=msg.chat_id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            sender={
                "id": sender.id,
                "first_name": sender.first_name,
                "last_name": sender.last_name,
                "full_name": sender.full_name
            } if sender else None,
            receiver={
                "id": receiver.id,
                "first_name": receiver.first_name,
                "last_name": receiver.last_name,
                "full_name": receiver.full_name
            } if receiver else None
        ))

    return message_list


@messageRouter.put("/{message_id}", response_model=MessageResponse)
async def update_message(
    message_id: int,
    message_update: MessageUpdate,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Update/edit a message. Only the sender can edit their own messages.
    """
    # Get message
    result = await db.execute(select(Message).where(Message.id == message_id))
    message = result.scalar_one_or_none()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Verify user is the sender
    if message.sender_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own messages"
        )

    # Update message content
    message.content = message_update.content
    await db.commit()
    await db.refresh(message)

    return message


@messageRouter.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a message. Only the sender can delete their own messages.
    """
    # Get message
    result = await db.execute(select(Message).where(Message.id == message_id))
    message = result.scalar_one_or_none()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Verify user is the sender
    if message.sender_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own messages"
        )

    # Delete message
    await db.delete(message)
    await db.commit()

    return None


@messageRouter.get("/latest/{chat_id}", response_model=List[MessageResponse])
async def get_latest_messages(
    chat_id: int,
    user_id: int,
    since_timestamp: datetime,
    db: AsyncSession = Depends(get_db)
):
    """
    Get messages sent after a specific timestamp.
    Useful for polling/real-time updates.
    """
    # Verify chat exists and user is a participant
    chat_result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = chat_result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    if user_id not in [chat.renter_id, chat.lender_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat"
        )

    # Get new messages
    messages_result = await db.execute(
        select(Message)
        .where(
            and_(
                Message.chat_id == chat_id,
                Message.timestamp > since_timestamp
            )
        )
        .order_by(Message.timestamp.asc())
    )
    messages = messages_result.scalars().all()

    return messages
