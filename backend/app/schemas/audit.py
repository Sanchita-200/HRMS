import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


# --- AuditLog Schemas ---
class AuditLogBase(BaseModel):
    action: str = Field(..., max_length=50)
    module: str = Field(..., max_length=100)
    old_values: Optional[str] = None
    new_values: Optional[str] = None
    ip_address: Optional[str] = Field(None, max_length=50)


class AuditLogCreate(AuditLogBase):
    user_id: Optional[uuid.UUID] = None


class AuditLogUpdate(BaseModel):
    # System logs are read-only and immutable. No fields editable.
    pass


class AuditLogResponse(AuditLogBase, AuditSchema):
    user_id: Optional[uuid.UUID] = None
    timestamp: datetime


# --- ActivityLog Schemas ---
class ActivityLogBase(BaseModel):
    activity_type: str = Field(..., max_length=100)
    description: str = Field(..., max_length=500)


class ActivityLogCreate(ActivityLogBase):
    employee_id: uuid.UUID


class ActivityLogUpdate(BaseModel):
    # Activity logs are read-only and immutable. No fields editable.
    pass


class ActivityLogResponse(ActivityLogBase, AuditSchema):
    employee_id: uuid.UUID
    timestamp: datetime
