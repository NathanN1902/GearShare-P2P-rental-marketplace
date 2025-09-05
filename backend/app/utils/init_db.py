from app.core.database import Base, engine
from app import models

def create_tables():
    Base.metadata.create_all(bind=engine)

