from app.core.database import Base
from sqlalchemy import Column, Integer, String

# # TODO : IMPLEMENT USER TABLE
# class User(Base):
#     __tablename__ = "Users"
#     id = Column(Integer, primary_key=True, index=True)
#     first_name = Column(String[50])
#     last_name = Column(String[50])
#     email = Column(String, unique=True, index=True)
#     password_hash = Column(String[250])