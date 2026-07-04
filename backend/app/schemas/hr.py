import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    working_hours: Optional[float] = Field(0.00, ge=0.00, le=24.00)
    overtime: Optional[float] = Field(0.00, ge=0.00, le=24.00)
    attendance_status: str = Field("present", max_length=50)
    location: Optional[str] = Field("office", max_length=255)


class AttendanceCreate(AttendanceBase):
    employee_id: uuid.UUID


class AttendanceUpdate(BaseModel):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    working_hours: Optional[float] = Field(None, ge=0.00, le=24.00)
    overtime: Optional[float] = Field(None, ge=0.00, le=24.00)
    attendance_status: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class AttendanceResponse(AttendanceBase, AuditSchema):
    employee_id: uuid.UUID


# --- LeaveType Schemas ---
class LeaveTypeBase(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., max_length=50)
    max_days: int = Field(..., ge=1)


class LeaveTypeCreate(LeaveTypeBase):
    pass


class LeaveTypeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    code: Optional[str] = Field(None, max_length=50)
    max_days: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None


class LeaveTypeResponse(LeaveTypeBase, AuditSchema):
    pass


# --- LeaveRequest Schemas ---
class LeaveRequestBase(BaseModel):
    reason: str = Field(..., max_length=500)
    start_date: date
    end_date: date


class LeaveRequestCreate(LeaveRequestBase):
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID


class LeaveRequestUpdate(BaseModel):
    reason: Optional[str] = Field(None, max_length=500)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    approval_status: Optional[str] = Field(None, max_length=50)  # pending, approved, rejected
    approved_by: Optional[uuid.UUID] = None
    approved_date: Optional[datetime] = None
    ai_recommendation: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None


class LeaveRequestResponse(LeaveRequestBase, AuditSchema):
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID
    approval_status: str
    approved_by: Optional[uuid.UUID] = None
    approved_date: Optional[datetime] = None
    ai_recommendation: Optional[str] = None
