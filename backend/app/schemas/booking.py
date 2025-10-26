from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class BookingStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class BookingCreate(BaseModel):
    start_date: datetime
    end_date: datetime
    item_id: int
    renter_id: int
    lender_id: int

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

    @validator('start_date')
    def validate_start_date(cls, v):
        if v <= datetime.now():
            raise ValueError('start_date must be in the future')
        return v


class BookingUpdate(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[BookingStatus] = None

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v is not None and 'start_date' in values and values['start_date'] is not None:
            if v <= values['start_date']:
                raise ValueError('end_date must be after start_date')
        return v


class BookingResponse(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime
    status: BookingStatus
    item_id: int
    renter_id: int
    lender_id: int
    
    class Config:
        from_attributes = True


class BookingWithDetails(BookingResponse):
    item: Optional[dict] = None  # Will be populated with item info
    renter: Optional[dict] = None  # Will be populated with renter info
    lender: Optional[dict] = None  # Will be populated with lender info


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
