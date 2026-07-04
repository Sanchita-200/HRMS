from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.models.payroll import EmployeeSalaryConfiguration, SalaryAuditLog
from app.models.organization import Employee
from pydantic import BaseModel, Field
import uuid
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class SalaryComponentDetail(BaseModel):
    name: str
    calc_type: str # pct or fixed
    value: float
    calculated_amount: float

class SalarySummaryOut(BaseModel):
    gross_salary: float
    total_allowances: float
    pf_deduction: float
    professional_tax: float
    net_salary: float

class SalaryConfigOut(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    monthly_wage: float
    yearly_wage: float
    working_days_per_week: int
    working_hours_per_day: int
    basic_pct: float
    hra_pct: float
    standard_allowance_type: str
    standard_allowance_val: float
    performance_bonus_type: str
    performance_bonus_val: float
    lta_type: str
    lta_val: float
    pf_employee_pct: float
    pf_employer_pct: float
    professional_tax: float
    fixed_allowance: float
    summary: SalarySummaryOut
    components: List[SalaryComponentDetail]

    class Config:
        from_attributes = True

class SalaryConfigUpdate(BaseModel):
    monthly_wage: float = Field(..., gt=0)
    working_days_per_week: int = Field(..., ge=1, le=7)
    working_hours_per_day: int = Field(..., ge=1, le=24)
    basic_pct: float = Field(..., ge=0, le=100)
    hra_pct: float = Field(..., ge=0, le=100)
    standard_allowance_type: str
    standard_allowance_val: float = Field(..., ge=0)
    performance_bonus_type: str
    performance_bonus_val: float = Field(..., ge=0)
    lta_type: str
    lta_val: float = Field(..., ge=0)
    pf_employee_pct: float = Field(default=12.00, ge=0, le=100)
    pf_employer_pct: float = Field(default=12.00, ge=0, le=100)
    professional_tax: float = Field(default=200.00, ge=0)

# Helper function to run the business calculations
def calculate_salary_details(data: SalaryConfigUpdate) -> tuple[float, list[SalaryComponentDetail], SalarySummaryOut]:
    monthly_wage = data.monthly_wage
    
    # 1. Basic Pay (Percentage of monthly wage)
    basic = (monthly_wage * data.basic_pct) / 100
    
    # 2. HRA (Percentage of basic salary)
    hra = (basic * data.hra_pct) / 100
    
    # 3. Standard Allowance
    if data.standard_allowance_type == "pct":
        standard = (monthly_wage * data.standard_allowance_val) / 100
    else:
        standard = data.standard_allowance_val
        
    # 4. Performance Bonus
    if data.performance_bonus_type == "pct":
        bonus = (monthly_wage * data.performance_bonus_val) / 100
    else:
        bonus = data.performance_bonus_val
        
    # 5. LTA
    if data.lta_type == "pct":
        lta = (monthly_wage * data.lta_val) / 100
    else:
        lta = data.lta_val
        
    # Validation check: Total of components cannot exceed Monthly Wage
    sum_components = basic + hra + standard + bonus + lta
    if sum_components > monthly_wage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_ERROR if hasattr(status, 'HTTP_400_BAD_ERROR') else 400,
            detail=f"Validation Error: Total salary components (₹{sum_components:,.2f}) exceed defined Monthly Wage (₹{monthly_wage:,.2f})"
        )
        
    # 6. Fixed Allowance (Remaining balance)
    fixed_allowance = monthly_wage - sum_components
    
    # Calculate PF (from Basic Salary)
    pf_deduction = (basic * data.pf_employee_pct) / 100
    
    gross_salary = monthly_wage
    total_allowances = hra + standard + bonus + lta + fixed_allowance
    net_salary = gross_salary - pf_deduction - data.professional_tax
    
    components = [
        SalaryComponentDetail(name="Basic Salary", calc_type="pct", value=data.basic_pct, calculated_amount=basic),
        SalaryComponentDetail(name="House Rent Allowance", calc_type="pct", value=data.hra_pct, calculated_amount=hra),
        SalaryComponentDetail(name="Standard Allowance", calc_type=data.standard_allowance_type, value=data.standard_allowance_val, calculated_amount=standard),
        SalaryComponentDetail(name="Performance Bonus", calc_type=data.performance_bonus_type, value=data.performance_bonus_val, calculated_amount=bonus),
        SalaryComponentDetail(name="Leave Travel Allowance", calc_type=data.lta_type, value=data.lta_val, calculated_amount=lta),
        SalaryComponentDetail(name="Fixed Allowance", calc_type="fixed", value=0.00, calculated_amount=fixed_allowance)
    ]
    
    summary = SalarySummaryOut(
        gross_salary=gross_salary,
        total_allowances=total_allowances,
        pf_deduction=pf_deduction,
        professional_tax=data.professional_tax,
        net_salary=net_salary
    )
    
    return fixed_allowance, components, summary

def make_salary_config_out(cfg: EmployeeSalaryConfiguration, components: list[SalaryComponentDetail], summary: SalarySummaryOut) -> SalaryConfigOut:
    return SalaryConfigOut(
        id=cfg.id,
        employee_id=cfg.employee_id,
        monthly_wage=float(cfg.monthly_wage),
        yearly_wage=float(cfg.monthly_wage * 12),
        working_days_per_week=cfg.working_days_per_week,
        working_hours_per_day=cfg.working_hours_per_day,
        basic_pct=float(cfg.basic_pct),
        hra_pct=float(cfg.hra_pct),
        standard_allowance_type=cfg.standard_allowance_type,
        standard_allowance_val=float(cfg.standard_allowance_val),
        performance_bonus_type=cfg.performance_bonus_type,
        performance_bonus_val=float(cfg.performance_bonus_val),
        lta_type=cfg.lta_type,
        lta_val=float(cfg.lta_val),
        pf_employee_pct=float(cfg.pf_employee_pct),
        pf_employer_pct=float(cfg.pf_employer_pct),
        professional_tax=float(cfg.professional_tax),
        fixed_allowance=float(cfg.monthly_wage - (
            ((cfg.monthly_wage * cfg.basic_pct) / 100) +
            ((((cfg.monthly_wage * cfg.basic_pct) / 100) * cfg.hra_pct) / 100) +
            (cfg.standard_allowance_val if cfg.standard_allowance_type == 'fixed' else (cfg.monthly_wage * cfg.standard_allowance_val) / 100) +
            (cfg.performance_bonus_val if cfg.performance_bonus_type == 'fixed' else (cfg.monthly_wage * cfg.performance_bonus_val) / 100) +
            (cfg.lta_val if cfg.lta_type == 'fixed' else (cfg.monthly_wage * cfg.lta_val) / 100)
        )),
        summary=summary,
        components=components
    )

@router.get("/salary/{employeeId}", response_model=SalaryConfigOut)
def get_employee_salary(employeeId: str, db: Session = Depends(get_db)):
    # Resolve employeeId to database record
    target_emp = None
    try:
        emp_uuid = uuid.UUID(employeeId)
        target_emp = db.query(Employee).filter(Employee.id == emp_uuid).first()
    except ValueError:
        if employeeId == "1":
            target_emp = db.query(Employee).filter(Employee.employee_number == "EMP/2026/001").first()
        elif employeeId == "2":
            target_emp = db.query(Employee).filter(Employee.employee_number == "EMP/2026/002").first()
        else:
            target_emp = db.query(Employee).filter(Employee.employee_number == employeeId).first()
            
    if not target_emp:
        raise HTTPException(status_code=404, detail="Employee record not found")
        
    resolved_id = target_emp.id
    
    cfg = db.query(EmployeeSalaryConfiguration).filter(EmployeeSalaryConfiguration.employee_id == resolved_id).first()
    if not cfg:
        # Create a default salary configuration if not exists
        cfg = EmployeeSalaryConfiguration(
            id=uuid.uuid4(),
            employee_id=resolved_id,
            monthly_wage=50000.00,
            working_days_per_week=5,
            working_hours_per_day=8,
            basic_pct=50.00,
            hra_pct=50.00,
            standard_allowance_type="fixed",
            standard_allowance_val=5000.00,
            performance_bonus_type="fixed",
            performance_bonus_val=3000.00,
            lta_type="fixed",
            lta_val=2000.00,
            pf_employee_pct=12.00,
            pf_employer_pct=12.00,
            professional_tax=200.00
        )
        db.add(cfg)
        db.commit()
        db.refresh(cfg)
        
    # Re-calculate on load to return standard structures
    temp_update = SalaryConfigUpdate(
        monthly_wage=float(cfg.monthly_wage),
        working_days_per_week=cfg.working_days_per_week,
        working_hours_per_day=cfg.working_hours_per_day,
        basic_pct=float(cfg.basic_pct),
        hra_pct=float(cfg.hra_pct),
        standard_allowance_type=cfg.standard_allowance_type,
        standard_allowance_val=float(cfg.standard_allowance_val),
        performance_bonus_type=cfg.performance_bonus_type,
        performance_bonus_val=float(cfg.performance_bonus_val),
        lta_type=cfg.lta_type,
        lta_val=float(cfg.lta_val),
        pf_employee_pct=float(cfg.pf_employee_pct),
        pf_employer_pct=float(cfg.pf_employer_pct),
        professional_tax=float(cfg.professional_tax)
    )
    
    fixed_allowance, components, summary = calculate_salary_details(temp_update)
    return make_salary_config_out(cfg, components, summary)

@router.put("/salary/{employeeId}", response_model=SalaryConfigOut)
def update_employee_salary(employeeId: str, data: SalaryConfigUpdate, db: Session = Depends(get_db)):
    # Resolve employeeId to database record
    target_emp = None
    try:
        emp_uuid = uuid.UUID(employeeId)
        target_emp = db.query(Employee).filter(Employee.id == emp_uuid).first()
    except ValueError:
        if employeeId == "1":
            target_emp = db.query(Employee).filter(Employee.employee_number == "EMP/2026/001").first()
        elif employeeId == "2":
            target_emp = db.query(Employee).filter(Employee.employee_number == "EMP/2026/002").first()
        else:
            target_emp = db.query(Employee).filter(Employee.employee_number == employeeId).first()
            
    if not target_emp:
        raise HTTPException(status_code=404, detail="Employee record not found")
        
    resolved_id = target_emp.id

    cfg = db.query(EmployeeSalaryConfiguration).filter(EmployeeSalaryConfiguration.employee_id == resolved_id).first()
    if not cfg:
        raise HTTPException(status_code=404, detail="Salary configuration not found")
        
    # Validate and calculate components
    fixed_allowance, components, summary = calculate_salary_details(data)
    
    # Audit log creation: Compare old values with new values
    old_values = {
        "monthly_wage": float(cfg.monthly_wage),
        "basic_pct": float(cfg.basic_pct),
        "hra_pct": float(cfg.hra_pct),
        "standard_allowance_val": float(cfg.standard_allowance_val),
        "performance_bonus_val": float(cfg.performance_bonus_val),
        "lta_val": float(cfg.lta_val)
    }
    
    # Apply updates
    cfg.monthly_wage = data.monthly_wage
    cfg.working_days_per_week = data.working_days_per_week
    cfg.working_hours_per_day = data.working_hours_per_day
    cfg.basic_pct = data.basic_pct
    cfg.hra_pct = data.hra_pct
    cfg.standard_allowance_type = data.standard_allowance_type
    cfg.standard_allowance_val = data.standard_allowance_val
    cfg.performance_bonus_type = data.performance_bonus_type
    cfg.performance_bonus_val = data.performance_bonus_val
    cfg.lta_type = data.lta_type
    cfg.lta_val = data.lta_val
    cfg.pf_employee_pct = data.pf_employee_pct
    cfg.pf_employer_pct = data.pf_employer_pct
    cfg.professional_tax = data.professional_tax
    
    db.commit()
    db.refresh(cfg)
    
    # Audit log changes write
    for field, old_val in old_values.items():
        new_val = getattr(data, field)
        if old_val != new_val:
            audit = SalaryAuditLog(
                id=uuid.uuid4(),
                employee_id=resolved_id,
                modified_by=None, # System Admin defaults
                field_name=field,
                old_value=str(old_val),
                new_value=str(new_val),
                timestamp=datetime.utcnow()
            )
            db.add(audit)
    db.commit()
    
    return make_salary_config_out(cfg, components, summary)

@router.get("/configuration")
def get_payroll_config():
    return {
        "default_pf_pct": 12.0,
        "default_prof_tax": 200.0,
        "supported_wage_types": ["monthly", "hourly", "annual"]
    }
