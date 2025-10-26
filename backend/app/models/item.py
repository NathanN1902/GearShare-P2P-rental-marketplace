from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String


class Item(Base):
    __tablename__ = "Items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)

    # TODO: integrate validation for type of rate
    rate = Column(String, nullable=False)

    # TODO: data validation for category 
    category = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("Users.id"), nullable=False)