from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

class Category(Base):
    __tablename__ = "Categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)

    