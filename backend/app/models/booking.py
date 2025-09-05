from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import DateTime

class Booking(Base):
    __tablename__ = "Bookings"

    id = Column(Integer, primary_key=True, index=True)

    # TODO: Add unique constraint on PK to prevent double bookings
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)

    # TODO: Enforce status (pending, accepted, rejected, cancelled, completed)
    status = Column(String, nullable=False)

    # TODO: Implement logic for viewing bookings as a renter, requests as a lender
    item_id = Column(Integer, ForeignKey("Items.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    lender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
