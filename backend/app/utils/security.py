from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from passlib.context import CryptContext
from app.core.config import settings

# CryptContext wrapper configuring bcrypt algorithm for salt/hash parsing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Encrypts a plain string password using bcrypt hashing context.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Validates a plain string password against its stored database bcrypt hash.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str, 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a JWT access token containing a subject (user claims) and expiry.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        
    to_encode = {
        "exp": int(expire.timestamp()),
        "sub": str(subject)
    }
    
    return jwt.encode(
        to_encode, 
        settings.JWT_SECRET, 
        algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decodes a JWT access token, verifying signature claims.
    Returns decoded dictionary claims payload, or raises jwt exceptions.
    """
    return jwt.decode(
        token, 
        settings.JWT_SECRET, 
        algorithms=[settings.JWT_ALGORITHM]
    )
