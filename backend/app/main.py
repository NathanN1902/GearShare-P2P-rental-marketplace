from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
import models
# from contextlib import asynccontextmanager
# from app.utils.init_db import create_tables
# from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Initialise database at start
#     print("Created tables")
#     create_tables()
#     # Separation point
#     yield
#     # Cleanup code can go here

app = FastAPI()

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

