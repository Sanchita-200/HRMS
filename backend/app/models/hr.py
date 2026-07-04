import uuid
from datetime import date, datetime
from typing import Optional
from sqlalchemy import Date, DateTime, ForeignKey, Index, Numeric, String, Time, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class Attendance(Base, AuditMixin):
    __tablename__ = "attendance"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"), 
        nullable=False
    )
    date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    check_in: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    check_out: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Working hours and overtime represented as Decimal for precision
    working_hours: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), default=0.00, nullable=True)
    overtime: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), default=0.00, nullable=True)
    
    attendance_status: Mapped[str] = mapped_column(String(50), default="present", nullable=False)  # present, absent, late, half-day
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # office, remote, client-site

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="attendances")

    # Indexes
    __table_args__ = (
        Index("idx_attendance_employee_date", "employee_id", "date", unique=True),
    )


class LeaveType(Base, AuditMixin):
    __tablename__ = "leave_types"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # CASUAL, SICK, PAID, MATERNITY
    max_days: Mapped[int] = mapped_column(default=10, nullable=False)

    # Relationships
    leave_requests: Mapped[list["LeaveRequest"]] = relationship("LeaveRequest", back_populates="leave_type")


class LeaveRequest(Base, AuditMixin):
    __tablename__ = "leave_requests"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"), 
        nullable=False
    )
    leave_type_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("leave_types.id", ondelete="RESTRICT"), 
        nullable=False
    )
    
    reason: Mapped[str] = mapped_column(String(500), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    
    approval_status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)  # pending, approved, rejected
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), 
        nullable=True
    )
    approved_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Store AI validation recommendation text
    ai_recommendation: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="leave_requests")
    leave_type: Mapped[LeaveType] = relationship("LeaveType", back_populates="leave_requests")
    approver: Mapped[Optional["User"]] = relationship("User")
