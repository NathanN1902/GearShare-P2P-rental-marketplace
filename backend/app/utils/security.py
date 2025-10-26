
from passlib.context import CryptContext
from passlib.hash import bcrypt
import secrets
import string

# Create a password context for bcrypt hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to verify against
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

def generate_password_reset_token() -> str:
    """
    Generate a secure random token for password reset.
    
    Returns:
        Random token string
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(32))

def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength requirements (relaxed version).
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if len(password) > 128:
        return False, "Password must be less than 128 characters long"
    
    # Only require minimum length - more user-friendly
    return True, ""
