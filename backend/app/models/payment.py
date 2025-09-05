from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import Float

class Payment(Base):
    __tablename__ = "Payments"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)

    # TODO: Enforce status (pending, completed, rejected)
    status = Column(String, nullable=False)

    booking_id = Column(Integer, ForeignKey("Bookings.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    lender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)