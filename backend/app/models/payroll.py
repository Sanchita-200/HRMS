import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import ForeignKey, Index, Numeric, String, UUID, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class Payroll(Base, AuditMixin):
    __tablename__ = "payrolls"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    # Financial fields mapped to Numeric for financial calculation accuracy
    basic_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    allowances: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    bonuses: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    tax: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    deductions: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    net_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    
    payroll_month: Mapped[str] = mapped_column(String(20), index=True, nullable=False)  # format: YYYY-MM

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="payrolls")
    components: Mapped[List["SalaryComponent"]] = relationship(
        "SalaryComponent", 
        back_populates="payroll", 
        cascade="all, delete-orphan"
    )

    # Indexes
    __table_args__ = (
        Index("idx_payroll_employee_month", "employee_id", "payroll_month", unique=True),
    )


class SalaryComponent(Base, AuditMixin):
    __tablename__ = "salary_components"

    payroll_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("payrolls.id", ondelete="CASCADE"), 
        nullable=False
    )
    component_name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., HRA, PF, Medical Allowance, Professional Tax
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # earning, deduction

    # Relationships
    payroll: Mapped[Payroll] = relationship("Payroll", back_populates="components")


class EmployeeSalaryConfiguration(Base, AuditMixin):
    __tablename__ = "employee_salary_configurations"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    monthly_wage: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    working_days_per_week: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    working_hours_per_day: Mapped[int] = mapped_column(Integer, default=8, nullable=False)
    
    basic_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=50.00, nullable=False)
    hra_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=50.00, nullable=False)
    
    standard_allowance_type: Mapped[str] = mapped_column(String(20), default="fixed", nullable=False) # pct or fixed
    standard_allowance_val: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    
    performance_bonus_type: Mapped[str] = mapped_column(String(20), default="fixed", nullable=False) # pct or fixed
    performance_bonus_val: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    
    lta_type: Mapped[str] = mapped_column(String(20), default="fixed", nullable=False) # pct or fixed
    lta_val: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)

    pf_employee_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=12.00, nullable=False)
    pf_employer_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=12.00, nullable=False)
    
    professional_tax: Mapped[float] = mapped_column(Numeric(12, 2), default=200.00, nullable=False)

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="salary_configuration")


class SalaryAuditLog(Base):
    __tablename__ = "salary_audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    employee_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    modified_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    field_name: Mapped[str] = mapped_column(String(100), nullable=False)
    old_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    new_value: Mapped[str] = mapped_column(String(255), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
