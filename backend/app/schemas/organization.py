import uuid
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.schemas.base import AuditSchema


# --- Department Schemas ---
class DepartmentBase(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., max_length=20)
    description: Optional[str] = Field(None, max_length=255)


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    code: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class DepartmentResponse(DepartmentBase, AuditSchema):
    pass


# --- Designation Schemas ---
class DesignationBase(BaseModel):
    job_title: str = Field(..., max_length=100)
    level: str = Field(..., max_length=20)
    salary_grade: Optional[str] = Field(None, max_length=10)


class DesignationCreate(DesignationBase):
    pass


class DesignationUpdate(BaseModel):
    job_title: Optional[str] = Field(None, max_length=100)
    level: Optional[str] = Field(None, max_length=20)
    salary_grade: Optional[str] = Field(None, max_length=10)
    is_active: Optional[bool] = None


class DesignationResponse(DesignationBase, AuditSchema):
    pass


# --- Employee Schemas ---
class EmployeeBase(BaseModel):
    employee_number: str = Field(..., max_length=50)
    full_name: str = Field(..., max_length=150)
    gender: Optional[str] = Field(None, max_length=20)
    dob: Optional[date] = None
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=255)
    joining_date: date
    emergency_contact: Optional[str] = Field(None, max_length=255)
    employment_status: str = Field("active", max_length=50)


class EmployeeCreate(EmployeeBase):
    user_id: Optional[uuid.UUID] = None
    department_id: Optional[uuid.UUID] = None
    designation_id: Optional[uuid.UUID] = None
    manager_id: Optional[uuid.UUID] = None
    profile_picture: Optional[str] = None


class EmployeeUpdate(BaseModel):
    employee_number: Optional[str] = Field(None, max_length=50)
    full_name: Optional[str] = Field(None, max_length=150)
    gender: Optional[str] = Field(None, max_length=20)
    dob: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=255)
    joining_date: Optional[date] = None
    department_id: Optional[uuid.UUID] = None
    designation_id: Optional[uuid.UUID] = None
    manager_id: Optional[uuid.UUID] = None
    profile_picture: Optional[str] = None
    emergency_contact: Optional[str] = Field(None, max_length=255)
    employment_status: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class EmployeeResponse(EmployeeBase, AuditSchema):
    user_id: Optional[uuid.UUID] = None
    department_id: Optional[uuid.UUID] = None
    designation_id: Optional[uuid.UUID] = None
    manager_id: Optional[uuid.UUID] = None
    profile_picture: Optional[str] = None
