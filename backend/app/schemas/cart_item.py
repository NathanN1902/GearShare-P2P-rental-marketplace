from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class CartItemCreate(BaseModel):
    cart_id: int
    item_id: int
    start_date: datetime
    end_date: datetime

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


class CartItemUpdate(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v is not None and 'start_date' in values and values['start_date'] is not None:
            if v <= values['start_date']:
                raise ValueError('end_date must be after start_date')
        return v


class CartItemResponse(BaseModel):
    id: int
    date_added: datetime
    start_date: datetime
    end_date: datetime
    cart_id: int
    item_id: int
    
    class Config:
        from_attributes = True


class CartItemWithDetails(CartItemResponse):
    item: Optional[dict] = None  # Will be populated with item info
    calculated_price: Optional[float] = None  # Will be calculated based on item price and duration
