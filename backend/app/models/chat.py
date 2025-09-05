from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

class Chat(Base):
    __tablename__ = "Chats"

    id = Column(Integer, primary_key=True, index=True)

    # TODO: Automatically initiate chat through booking request event
    booking_id = Column(Integer, ForeignKey("Bookings.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    lender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)