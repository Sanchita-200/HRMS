import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


# --- AIConversation Schemas ---
class AIConversationBase(BaseModel):
    conversation_id: uuid.UUID
    prompt: str
    response: str


class AIConversationCreate(AIConversationBase):
    user_id: uuid.UUID


class AIConversationUpdate(BaseModel):
    prompt: Optional[str] = None
    response: Optional[str] = None
    is_active: Optional[bool] = None


class AIConversationResponse(AIConversationBase, AuditSchema):
    user_id: uuid.UUID
    timestamp: datetime


# --- AIEmbedding Schemas ---
class AIEmbeddingBase(BaseModel):
    vector_id: str = Field(..., max_length=255)
    model: str = Field(..., max_length=100)


class AIEmbeddingCreate(AIEmbeddingBase):
    document_id: uuid.UUID
    embedding: List[float] = Field(..., description="Vector representation list of floats")


class AIEmbeddingUpdate(BaseModel):
    vector_id: Optional[str] = Field(None, max_length=255)
    model: Optional[str] = Field(None, max_length=100)
    embedding: Optional[List[float]] = None
    is_active: Optional[bool] = None


class AIEmbeddingResponse(AIEmbeddingBase, AuditSchema):
    document_id: uuid.UUID
    # Exclude raw embedding float lists in normal responses to save payload overhead
