import uuid
from typing import List
from sqlalchemy import ForeignKey, Index, Numeric, String, UUID
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
