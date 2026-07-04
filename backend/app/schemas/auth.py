import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.schemas.base import AuditSchema


# --- Permission Schemas ---
class PermissionBase(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., max_length=50)
    description: Optional[str] = Field(None, max_length=255)


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class PermissionResponse(PermissionBase, AuditSchema):
    pass


# --- Role Schemas ---
class RoleBase(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., max_length=50)
    description: Optional[str] = Field(None, max_length=255)


class RoleCreate(RoleBase):
    permission_ids: Optional[List[uuid.UUID]] = []


class RoleUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=255)
    permission_ids: Optional[List[uuid.UUID]] = None
    is_active: Optional[bool] = None


class RoleResponse(RoleBase, AuditSchema):
    # Includes inline permissions in detail responses
    permissions: List[PermissionResponse] = []


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Plaintext raw input password")
    role_id: uuid.UUID


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    role_id: Optional[uuid.UUID] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase, AuditSchema):
    role_id: uuid.UUID
    last_login: Optional[datetime] = None


# --- Session Schemas ---
class SessionBase(BaseModel):
    device: Optional[str] = Field(None, max_length=255)


class SessionCreate(SessionBase):
    user_id: uuid.UUID
    refresh_token: str = Field(..., max_length=512)
    expiry: datetime


class SessionUpdate(BaseModel):
    refresh_token: Optional[str] = Field(None, max_length=512)
    expiry: Optional[datetime] = None
    is_active: Optional[bool] = None


class SessionResponse(SessionBase, AuditSchema):
    user_id: uuid.UUID
    refresh_token: str
    expiry: datetime
