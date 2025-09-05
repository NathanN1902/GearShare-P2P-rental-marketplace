from pydantic import BaseModel, EmailStr
from typing import Union


class UserCreate(BaseModel):
    username : str
    first_name : str
    last_name : str
    email : EmailStr
    password : str 

class UserOutput(BaseModel):
    id : int
    username : str
    first_name : str
    last_name : str
    email : EmailStr

class UserUpdate(BaseModel):
    id : int
    username : Union[str, None] = None
    first_name : Union[str, None] = None
    last_name : Union[str, None] = None
    email : Union[EmailStr, None] = None
    password : Union[str, None] = None

class UserLogin(BaseModel):
    username : str
    password : str

class UserToken(BaseModel):
    token : str