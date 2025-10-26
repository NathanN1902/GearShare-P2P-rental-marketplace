from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    review: str = Field(..., min_length=1, max_length=1000)
    rating: int = Field(..., ge=1, le=5)
    item_id: int
    renter_id: int
    lender_id: int

    @validator('review')
    def validate_review(cls, v):
        if not v.strip():
            raise ValueError('Review content cannot be empty')
        return v.strip()

    @validator('rating')
    def validate_rating(cls, v):
        # Allow only increments of 0.5 (1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
        if v not in [1, 2, 3, 4, 5]:
            raise ValueError('Rating must be between 1 and 5')
        return v


class ReviewUpdate(BaseModel):
    review: Optional[str] = Field(None, min_length=1, max_length=1000)
    rating: Optional[int] = Field(None, ge=1, le=5)

    @validator('review')
    def validate_review(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Review content cannot be empty')
        return v.strip() if v is not None else v

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and v not in [1, 2, 3, 4, 5]:
            raise ValueError('Rating must be between 1 and 5')
        return v


class ReviewResponse(BaseModel):
    id: int
    review: str
    rating: int
    item_id: int
    renter_id: int
    lender_id: int
    
    class Config:
        from_attributes = True


class ReviewWithDetails(ReviewResponse):
    item: Optional[dict] = None  # Will be populated with item info
    renter: Optional[dict] = None  # Will be populated with renter info
    lender: Optional[dict] = None  # Will be populated with lender info


class ReviewSummary(BaseModel):
    item_id: int
    average_rating: float
    total_reviews: int
    rating_breakdown: dict  # {1: count, 2: count, 3: count, 4: count, 5: count}