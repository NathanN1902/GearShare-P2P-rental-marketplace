from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class RentalRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class RentalRequestCreate(BaseModel):
    item_id: int
    renter_id: int
    lender_id: int
    rent_start: datetime
    rent_end: datetime

    @validator('rent_end')
    def validate_rent_end(cls, v, values):
        if 'rent_start' in values and v <= values['rent_start']:
            raise ValueError('rent_end must be after rent_start')
        return v

    @validator('rent_start')
    def validate_rent_start(cls, v):
        if v <= datetime.now():
            raise ValueError('rent_start must be in the future')
        return v


class RentalRequestUpdate(BaseModel):
    rent_start: Optional[datetime] = None
    rent_end: Optional[datetime] = None
    status: Optional[RentalRequestStatus] = None

    @validator('rent_end')
    def validate_rent_end(cls, v, values):
        if v is not None and 'rent_start' in values and values['rent_start'] is not None:
            if v <= values['rent_start']:
                raise ValueError('rent_end must be after rent_start')
        return v


class RentalRequestResponse(BaseModel):
    id: int
    date_requested: datetime
    rent_start: datetime
    rent_end: datetime
    status: RentalRequestStatus
    item_id: int
    renter_id: int
    lender_id: int
    
    class Config:
        from_attributes = True


class RentalRequestWithDetails(RentalRequestResponse):
    item: Optional[dict] = None  # Will be populated with item info
    renter: Optional[dict] = None  # Will be populated with renter info
    lender: Optional[dict] = None  # Will be populated with lender info


class RentalRequestStatusUpdate(BaseModel):
    status: RentalRequestStatus