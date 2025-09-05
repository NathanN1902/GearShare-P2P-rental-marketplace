from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

class Cart_Item(Base):
    __tablename__ = "Cart_Items"

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False)

    # TODO: Implement start_date and end_date validation to avoid double booking
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)

    cart_id = Column(Integer, ForeignKey("Carts.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("Items.id"), nullable=False)