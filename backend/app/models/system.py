import uuid
from typing import Optional
from sqlalchemy import Boolean, ForeignKey, String, Text, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class SystemSetting(Base, AuditMixin):
    __tablename__ = "system_settings"

    setting_key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    setting_value: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="general", index=True, nullable=False)  # general, mail, security, ai


class Notification(Base, AuditMixin):
    __tablename__ = "notifications"

    recipient_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    read_status: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    priority: Mapped[str] = mapped_column(String(50), default="normal", nullable=False)  # low, normal, high, critical

    # Relationships
    recipient: Mapped["User"] = relationship("User", back_populates="notifications")
