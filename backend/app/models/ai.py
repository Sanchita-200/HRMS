import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, String, Text, UUID
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.base import AuditMixin


class AIConversation(Base, AuditMixin):
    __tablename__ = "ai_conversations"

    # UUID to group message prompts together under a single chat thread context
    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="conversations")


class AIEmbedding(Base, AuditMixin):
    __tablename__ = "ai_embeddings"

    document_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), 
        unique=True,
        nullable=False
    )
    
    # Store raw vector representation for PostgreSQL indexing if using pgvector in future
    # Using Postgres-specific float array type
    embedding: Mapped[list[float]] = mapped_column(ARRAY(Float), nullable=False)
    
    vector_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)  # Chroma DB vector key reference
    model: Mapped[str] = mapped_column(String(100), nullable=False)  # Embedding model used

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="embedding_ref")
