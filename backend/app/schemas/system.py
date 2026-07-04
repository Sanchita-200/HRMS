import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


# --- SystemSetting Schemas ---
class SystemSettingBase(BaseModel):
    setting_key: str = Field(..., max_length=100)
    setting_value: str
    category: str = Field("general", max_length=100)


class SystemSettingCreate(SystemSettingBase):
    pass


class SystemSettingUpdate(BaseModel):
    setting_value: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class SystemSettingResponse(SystemSettingBase, AuditSchema):
    pass


# --- Notification Schemas ---
class NotificationBase(BaseModel):
    title: str = Field(..., max_length=150)
    message: str
    read_status: bool = False
    priority: str = Field("normal", max_length=50)


class NotificationCreate(NotificationBase):
    recipient_id: uuid.UUID


class NotificationUpdate(BaseModel):
    read_status: Optional[bool] = None
    is_active: Optional[bool] = None


class NotificationResponse(NotificationBase, AuditSchema):
    recipient_id: uuid.UUID
