from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

class Message(Base):
    __tablename__ = "Messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)

    # TODO: Real-time messaging logic 
    timestamp = Column(DateTime, nullable=False)
    chat_id = Column(Integer, ForeignKey("Chats.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("Users.id"), nullable=False)

