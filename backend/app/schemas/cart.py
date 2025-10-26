from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CartCreate(BaseModel):
    user_id: int


class CartResponse(BaseModel):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


class CartWithItems(CartResponse):
    items: Optional[List[dict]] = None  # Will be populated with cart items
    total_items: int = 0
    total_value: float = 0.0