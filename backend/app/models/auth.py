import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, DateTime, ForeignKey, String, Table, UniqueConstraint, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin

# Many-to-many relationship join table between Roles and Permissions
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column(
        "role_id", 
        UUID(as_uuid=True), 
        ForeignKey("roles.id", ondelete="CASCADE"), 
        primary_key=True
    ),
    Column(
        "permission_id", 
        UUID(as_uuid=True), 
        ForeignKey("permissions.id", ondelete="CASCADE"), 
        primary_key=True
    )
)


class Permission(Base, AuditMixin):
    __tablename__ = "permissions"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        "Role", 
        secondary=role_permissions, 
        back_populates="permissions"
    )


class Role(Base, AuditMixin):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    permissions: Mapped[List[Permission]] = relationship(
        "Permission", 
        secondary=role_permissions, 
        back_populates="roles"
    )
    users: Mapped[List["User"]] = relationship("User", back_populates="role")


class User(Base, AuditMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    role_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("roles.id", ondelete="RESTRICT"), 
        nullable=False
    )
    
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )

    # Relationships
    role: Mapped[Role] = relationship("Role", back_populates="users")
    employee: Mapped[Optional["Employee"]] = relationship(
        "Employee", 
        back_populates="user", 
        uselist=False
    )
    sessions: Mapped[List["Session"]] = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    conversations: Mapped[List["AIConversation"]] = relationship("AIConversation", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="recipient", cascade="all, delete-orphan")


class Session(Base, AuditMixin):
    __tablename__ = "sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    refresh_token: Mapped[str] = mapped_column(String(512), unique=True, index=True, nullable=False)
    expiry: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    device: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="sessions")
