from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    chat_id: int
    sender_id: int
    receiver_id: int

    @validator('content')
    def validate_content(cls, v):
        if not v.strip():
            raise ValueError('Message content cannot be empty')
        return v.strip()


class MessageResponse(BaseModel):
    id: int
    content: str
    timestamp: datetime
    chat_id: int
    sender_id: int
    receiver_id: int
    
    class Config:
        from_attributes = True


class MessageWithDetails(MessageResponse):
    sender: Optional[dict] = None  # Will be populated with sender info
    receiver: Optional[dict] = None  # Will be populated with receiver info


class MessageUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

    @validator('content')
    def validate_content(cls, v):
        if not v.strip():
            raise ValueError('Message content cannot be empty')
        return v.strip()
