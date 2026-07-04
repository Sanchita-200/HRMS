from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.dependencies.db import get_db
from app.models.organization import Employee, Department, Designation
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional
import uuid

router = APIRouter()

class EmployeeOut(BaseModel):
    id: uuid.UUID
    employee_number: str
    full_name: str
    email: str
    phone: Optional[str]
    department_name: Optional[str]
    designation_name: Optional[str]
    joining_date: date
    employment_status: str

    class Config:
        from_attributes = True

class EmployeeCreate(BaseModel):
    employee_number: str
    full_name: str
    email: EmailStr
    phone: Optional[str]
    joining_date: date
    department_id: Optional[uuid.UUID]
    designation_id: Optional[uuid.UUID]

@router.get("/", response_model=List[EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).options(
        joinedload(Employee.department),
        joinedload(Employee.designation)
    ).all()
    
    result = []
    for emp in employees:
        result.append(EmployeeOut(
            id=emp.id,
            employee_number=emp.employee_number,
            full_name=emp.full_name,
            email=emp.email,
            phone=emp.phone,
            department_name=emp.department.name if emp.department else "General",
            designation_name=emp.designation.job_title if emp.designation else "Staff",
            joining_date=emp.joining_date,
            employment_status=emp.employment_status
        ))
    return result

@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(emp_in: EmployeeCreate, db: Session = Depends(get_db)):
    # Check if duplicate email
    db_email = db.query(Employee).filter(Employee.email == emp_in.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Check if duplicate employee number
    db_num = db.query(Employee).filter(Employee.employee_number == emp_in.employee_number).first()
    if db_num:
        raise HTTPException(status_code=400, detail="Employee number already registered")

    emp = Employee(
        id=uuid.uuid4(),
        employee_number=emp_in.employee_number,
        full_name=emp_in.full_name,
        email=emp_in.email,
        phone=emp_in.phone,
        joining_date=emp_in.joining_date,
        department_id=emp_in.department_id,
        designation_id=emp_in.designation_id,
        employment_status="active"
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return EmployeeOut(
        id=emp.id,
        employee_number=emp.employee_number,
        full_name=emp.full_name,
        email=emp.email,
        phone=emp.phone,
        department_name=emp.department.name if emp.department else "General",
        designation_name=emp.designation.job_title if emp.designation else "Staff",
        joining_date=emp.joining_date,
        employment_status=emp.employment_status
    )
