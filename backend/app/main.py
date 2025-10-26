import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.core import SessionLocal, engine
from app.routers import authRouter, itemListingRouter
from app.utils.init_db import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initiate DB
    await create_tables()
    print("Tables created")
    # Separator
    yield

# Create FastAPI app
app = FastAPI(lifespan=lifespan)

# Include authentication routers
app.include_router(authRouter, prefix="/auth", tags=["auth"])
app.include_router(itemListingRouter, prefix="/items", tags=["itemListing"])

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

# confirm FastAPI is running
@app.get("/health")
def app_confirm():
    return {"status": "Healthy..."}

# TODO : Create endpoints

# main function
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

