from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class RateType(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class ItemCategory(str, Enum):
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"
    VEHICLES = "vehicles"
    TOOLS = "tools"
    CLOTHING = "clothing"
    SPORTS = "sports"
    BOOKS = "books"
    OTHER = "other"


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    price: float = Field(..., gt=0)
    rate: RateType
    category: Optional[ItemCategory] = None
    owner_id: int

    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Price must be greater than 0')
        return round(v, 2)


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    price: Optional[float] = Field(None, gt=0)
    rate: Optional[RateType] = None
    category: Optional[ItemCategory] = None

    @validator('price')
    def validate_price(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Price must be greater than 0')
        return round(v, 2) if v is not None else v


class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    rate: RateType
    category: Optional[ItemCategory]
    owner_id: int
    
    class Config:
        from_attributes = True


class ItemWithOwner(ItemResponse):
    owner: Optional[dict] = None  # Will be populated with user info


class ItemSearch(BaseModel):
    name: Optional[str] = None
    category: Optional[ItemCategory] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    rate: Optional[RateType] = None
    owner_id: Optional[int] = None

    @validator('max_price')
    def validate_price_range(cls, v, values):
        if v is not None and 'min_price' in values and values['min_price'] is not None:
            if v < values['min_price']:
                raise ValueError('max_price must be greater than or equal to min_price')
        return v