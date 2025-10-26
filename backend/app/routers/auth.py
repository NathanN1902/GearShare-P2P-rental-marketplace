from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas import UserLogin, UserCreate
from app.models.user import User
from app.core.database import get_db

authRouter = APIRouter()

@authRouter.post("/login")
async def login(loginDetails: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login endpoint that validates account existence and credentials.
    Only allows login if the account exists in the database.
    """
    # Check if user account exists in database
    result = await db.execute(select(User).where(User.email == loginDetails.email))
    user = result.scalar_one_or_none()
    
    if not user:
        # Account does not exist - return authentication error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"  # Generic message for security
        )
    
    # Account exists - verify password
    if not user.check_password(loginDetails.password):
        # Wrong password - return authentication error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"  # Generic message for security
        )
    
    # Account exists and password is correct - login successful
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@authRouter.post("/register")
async def register(signUpDetails: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register endpoint that creates a new account.
    Prevents duplicate accounts with the same email.
    """
    # Check if account already exists
    result = await db.execute(select(User).where(User.email == signUpDetails.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user account
    user = User(
        first_name=signUpDetails.first_name,
        last_name=signUpDetails.last_name,
        email=signUpDetails.email
    )
    user.set_password(signUpDetails.password)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return {
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": user.full_name
        }
    }
