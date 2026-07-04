import uuid
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


# --- SalaryComponent Schemas ---
class SalaryComponentBase(BaseModel):
    component_name: str = Field(..., max_length=100)
    amount: float = Field(..., ge=0.00)
    type: str = Field(..., max_length=50)  # earning, deduction


class SalaryComponentCreate(SalaryComponentBase):
    pass


class SalaryComponentUpdate(BaseModel):
    component_name: Optional[str] = Field(None, max_length=100)
    amount: Optional[float] = Field(None, ge=0.00)
    type: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class SalaryComponentResponse(SalaryComponentBase, AuditSchema):
    payroll_id: uuid.UUID


# --- Payroll Schemas ---
class PayrollBase(BaseModel):
    basic_salary: float = Field(..., ge=0.00)
    allowances: float = Field(0.00, ge=0.00)
    bonuses: float = Field(0.00, ge=0.00)
    tax: float = Field(0.00, ge=0.00)
    deductions: float = Field(0.00, ge=0.00)
    net_salary: float = Field(..., ge=0.00)
    payroll_month: str = Field(..., max_length=20)  # format: YYYY-MM


class PayrollCreate(PayrollBase):
    employee_id: uuid.UUID
    components: Optional[List[SalaryComponentCreate]] = []


class PayrollUpdate(BaseModel):
    basic_salary: Optional[float] = Field(None, ge=0.00)
    allowances: Optional[float] = Field(None, ge=0.00)
    bonuses: Optional[float] = Field(None, ge=0.00)
    tax: Optional[float] = Field(None, ge=0.00)
    deductions: Optional[float] = Field(None, ge=0.00)
    net_salary: Optional[float] = Field(None, ge=0.00)
    payroll_month: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None


class PayrollResponse(PayrollBase, AuditSchema):
    employee_id: uuid.UUID
    components: List[SalaryComponentResponse] = []
