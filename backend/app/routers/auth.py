from fastapi import APIRouter
from app.schemas import UserLogin, UserCreate

authRouter = APIRouter()

@authRouter.post("/login")
def login(loginDetails: UserLogin):
    return {"message": "Login successful"}

@authRouter.post("/register")
def register(signUpDetails: UserCreate):
    return {"message": "User registered successfully"}
