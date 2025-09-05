from app.core.database import Base

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    # TODO: Implement password hash and verification logic
    password_hash = Column(String, nullable=False)
