import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.core import SessionLocal, engine
from app.routers import authRouter

# TODO: implement async def lifespan(app: FastAPI), from contextlib import asynccontextmanager

# Create FastAPI app
app = FastAPI()

# Include authentication routers
app.include_router(authRouter, prefix="/auth", tags=["auth"])

# FastAPI's CORS middleware for frontend applications origins
origins = [
    'http://localhost:3000'
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# TODO: Implement postgres tables initiation, import init_db.py from utils

# confirm FastAPI is running
@app.get("/confirm")
def app_confirm():
    return {"status": "Running..."}

# TODO : Create endpoints

# main function
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

