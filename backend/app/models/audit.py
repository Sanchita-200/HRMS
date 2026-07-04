import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, String, Text, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class AuditLog(Base, AuditMixin):
    __tablename__ = "audit_logs"

    # User who triggered the data modification
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    action: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # CREATE, UPDATE, DELETE, LOGIN
    module: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # Users, Employees, LeaveRequests, etc.
    
    # Store schema difference snapshots as text (serialized JSON strings)
    old_values: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    new_values: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User")


class ActivityLog(Base, AuditMixin):
    __tablename__ = "activity_logs"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"), 
        nullable=False
    )
    activity_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # e.g., check-in, leave-applied, document-signed
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="activity_logs")
