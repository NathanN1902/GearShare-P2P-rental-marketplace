from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String


class Item(Base):
    __tablename__ = "Items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    category_id = Column(Integer, ForeignKey("Categories.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("Users.id"), nullable=False)