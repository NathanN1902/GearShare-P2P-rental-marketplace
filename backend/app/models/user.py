from app.core.database import Base
from app.utils.security import hash_password, verify_password

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    def set_password(self, password: str) -> None:
        """
        Set the user's password by hashing the plain text password.
        
        Args:
            password: Plain text password to hash and store
        """
        self.password_hash = hash_password(password)

    def check_password(self, password: str) -> bool:
        """
        Check if the provided password matches the user's hashed password.
        
        Args:
            password: Plain text password to verify
            
        Returns:
            True if password matches, False otherwise
        """
        return verify_password(password, self.password_hash)

    @property
    def full_name(self) -> str:
        """
        Get the user's full name.
        
        Returns:
            Full name string
        """
        return f"{self.first_name} {self.last_name}"
