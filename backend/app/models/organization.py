import uuid
from datetime import date
from typing import List, Optional
from sqlalchemy import Date, ForeignKey, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class Department(Base, AuditMixin):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="department")


class Designation(Base, AuditMixin):
    __tablename__ = "designations"

    job_title: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    level: Mapped[String] = mapped_column(String(20), nullable=False)  # e.g., L1, L2, L3, Senior, Lead
    salary_grade: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # e.g. SG1, SG2

    # Relationships
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="designation")


class Employee(Base, AuditMixin):
    __tablename__ = "employees"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), 
        unique=True, 
        nullable=True
    )
    employee_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    dob: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"), 
        nullable=True
    )
    designation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("designations.id", ondelete="SET NULL"), 
        nullable=True
    )
    manager_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("employees.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    profile_picture: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    emergency_contact: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    employment_status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)  # e.g., active, suspended, terminated

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="employee")
    department: Mapped[Optional[Department]] = relationship("Department", back_populates="employees")
    designation: Mapped[Optional[Designation]] = relationship("Designation", back_populates="employees")
    
    # Manager/Subordinate self-referencing relationship
    manager: Mapped[Optional["Employee"]] = relationship(
        "Employee", 
        remote_side="Employee.id", 
        back_populates="subordinates"
    )
    subordinates: Mapped[List["Employee"]] = relationship(
        "Employee", 
        back_populates="manager"
    )

    # Work Modules Relationships
    attendances: Mapped[List["Attendance"]] = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    leave_requests: Mapped[List["LeaveRequest"]] = relationship("LeaveRequest", back_populates="employee", cascade="all, delete-orphan")
    payrolls: Mapped[List["Payroll"]] = relationship("Payroll", back_populates="employee", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="employee", cascade="all, delete-orphan")
    activity_logs: Mapped[List["ActivityLog"]] = relationship("ActivityLog", back_populates="employee", cascade="all, delete-orphan")
    salary_configuration: Mapped[Optional["EmployeeSalaryConfiguration"]] = relationship(
        "EmployeeSalaryConfiguration", 
        back_populates="employee", 
        uselist=False, 
        cascade="all, delete-orphan"
    )
