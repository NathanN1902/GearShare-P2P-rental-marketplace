from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REJECTED = "rejected"
    REFUNDED = "refunded"


class PaymentCreate(BaseModel):
    amount: float = Field(..., gt=0)
    booking_id: int
    renter_id: int
    lender_id: int

    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be greater than 0')
        return round(v, 2)


class PaymentUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    status: Optional[PaymentStatus] = None

    @validator('amount')
    def validate_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Amount must be greater than 0')
        return round(v, 2) if v is not None else v


class PaymentResponse(BaseModel):
    id: int
    amount: float
    date_paid: datetime
    status: PaymentStatus
    booking_id: int
    renter_id: int
    lender_id: int
    
    class Config:
        from_attributes = True


class PaymentWithDetails(PaymentResponse):
    booking: Optional[dict] = None  # Will be populated with booking info
    renter: Optional[dict] = None  # Will be populated with renter info
    lender: Optional[dict] = None  # Will be populated with lender info


class PaymentStatusUpdate(BaseModel):
    status: PaymentStatus


class PaymentRefund(BaseModel):
    payment_id: int
    refund_amount: Optional[float] = None  # If None, refund full amount
    reason: Optional[str] = None

    @validator('refund_amount')
    def validate_refund_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Refund amount must be greater than 0')
        return round(v, 2) if v is not None else v