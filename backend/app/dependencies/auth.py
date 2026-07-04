from typing import Optional
from fastapi import Depends, Header
from pydantic import BaseModel
from app.exceptions.custom_exceptions import ForbiddenException, UnauthorizedException


class UserClaims(BaseModel):
    """
    Schema representation of authenticated user identity.
    """
    id: int
    email: str
    role: str
    is_active: bool = True


async def get_current_user(
    authorization: Optional[str] = Header(None, description="JWT token header (Bearer <token>)")
) -> UserClaims:
    """
    Dependency returning the currently authenticated user.
    Uses placeholder claims. In subsequent modules, this will parse and decode JWT keys.
    """
    # Placeholder login validation simulation
    # If authorization header is provided with 'invalid', raise Unauthorized
    if authorization and "invalid" in authorization.lower():
        raise UnauthorizedException("Auth token is invalid or expired")

    # Default mockup user profile returned for design checks
    return UserClaims(
        id=1,
        email="developer.admin@hrms.com",
        role="admin",  # Defaulting to admin to simplify initial integration testing
        is_active=True
    )


async def get_admin_user(
    current_user: UserClaims = Depends(get_current_user)
) -> UserClaims:
    """
    Dependency validating that the authenticated user possesses admin authorization.
    """
    if current_user.role.lower() != "admin":
        raise ForbiddenException("Administrator permissions are required to perform this request")
        
    return current_user
