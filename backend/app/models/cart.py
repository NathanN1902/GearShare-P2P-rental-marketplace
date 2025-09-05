from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey

class Cart(Base):
    __tablename__ = "Carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)