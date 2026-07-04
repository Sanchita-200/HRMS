import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class Document(Base, AuditMixin):
    __tablename__ = "documents"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"), 
        nullable=False
    )
    document_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # e.g., resume, contract, id_proof, payslip
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)  # path on disk or cloud store URL
    upload_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    
    # Store correlation key for vector embedding mappings
    embedding_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), 
        nullable=True
    )

    # Relationships
    employee: Mapped["Employee"] = relationship("Employee", back_populates="documents")
    embedding_ref: Mapped[Optional["AIEmbedding"]] = relationship(
        "AIEmbedding", 
        back_populates="document", 
        cascade="all, delete-orphan", 
        uselist=False
    )
