from fastapi import APIRouter

authRouter = APIRouter()

@authRouter.post("/login")
def login():
    return {"message": "Login successful"}

@authRouter.post("/register")
def register():
    return {"message": "User registered successfully"}
