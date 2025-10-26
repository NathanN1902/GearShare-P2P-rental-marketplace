from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

class Rental_Request(Base):
    __tablename__ = "Rental_Requests"

    id = Column(Integer, primary_key=True, index=True)
    date_requested = Column(DateTime, nullable=False)
    rent_start = Column(DateTime, nullable=False)
    rent_end = Column(DateTime, nullable=False)

    # TODO: Enforce status (pending, approved, rejected)
    status = Column(String, nullable=False)

    item_id = Column(Integer, ForeignKey("Items.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    lender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)