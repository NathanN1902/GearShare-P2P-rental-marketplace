from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
# from contextlib import asynccontextmanager
# from app.utils.init_db import create_tables
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import authRouter

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Initialise database at start
#     print("Created tables")
#     create_tables()
#     # Separation point
#     yield
#     # Cleanup code can go here

app = FastAPI()

# Include authentication routers
app.include_router(authRouter, prefix="/auth", tags=["auth"])

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

# # creates all tables and columns in postgres
# models.Base.metadata.create_all(bind=engine)

# confirm FastAPI is running
@app.get("/confirm")
def app_confirm():
    return {"status": "Running..."}

# TO DO : Create endpoints

# main function

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

