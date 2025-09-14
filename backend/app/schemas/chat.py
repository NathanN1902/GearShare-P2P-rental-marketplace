from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ChatCreate(BaseModel):
    booking_id: int
    renter_id: int
    lender_id: int


class ChatResponse(BaseModel):
    id: int
    booking_id: int
    renter_id: int
    lender_id: int
    
    class Config:
        from_attributes = True


class ChatWithDetails(ChatResponse):
    booking: Optional[dict] = None  # Will be populated with booking info
    renter: Optional[dict] = None  # Will be populated with renter info
    lender: Optional[dict] = None  # Will be populated with lender info
    messages: Optional[List[dict]] = None  # Will be populated with messages


class ChatList(BaseModel):
    id: int
    booking_id: int
    other_user: dict  # The other participant in the chat
    last_message: Optional[dict] = None
    unread_count: int = 0
    
    class Config:
        from_attributes = True
