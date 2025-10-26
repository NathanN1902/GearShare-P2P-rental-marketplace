from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas import ItemCreate, ItemUpdate, ItemResponse, ItemWithOwner, ItemSearch, RateType, ItemCategory
from app.models.item import Item
from app.core.database import get_db


itemListingRouter = APIRouter()

# TODO: create item listing
@itemListingRouter.post("/create")
async def create_item_listing(item: ItemCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new item listing.
    """
    result = await Item.create_item_listing(item, db)

    return {
        "message": "Item listing created successfully",
        "item": {
            "id": result.id,
            "name": result.name,
            "description": result.description,
            "price": result.price,
            "rate": result.rate,
            "category": result.category,
            "owner_id": result.owner_id
        }
    }


# # TODO: update item listing
@itemListingRouter.put("/update")
async def update_item_listing(item_id: int, item_update: ItemUpdate, db: AsyncSession = Depends(get_db)):
    """
    Update an existing item listing.
    """
    updated_item = await Item.update_item_listing(item_id, item_update, db)
    if not updated_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return updated_item


# TODO: delete item listing
@itemListingRouter.delete("/delete")
async def delete_item_listing(item_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete an item listing.
    """
    deleted_item = await Item.delete_item_listing(item_id, db)
    if not deleted_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return {"detail": "Item deleted successfully"}


# TODO: get item listing
@itemListingRouter.get("/get")
async def get_item_listing(item_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get an item listing.
    """
    item = await Item.get_item_listing(item_id, db)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@itemListingRouter.get("/get_all")
async def get_all_item_listings(db: AsyncSession = Depends(get_db)):
    """
    Get all item listings.
    """
    result = await db.execute(select(Item))
    items = result.scalars().all()
    return items

