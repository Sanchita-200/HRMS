import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.base import AuditSchema


class DocumentBase(BaseModel):
    document_type: str = Field(..., max_length=100)
    file_name: str = Field(..., max_length=255)
    storage_path: str = Field(..., max_length=512)


class DocumentCreate(DocumentBase):
    employee_id: uuid.UUID
    embedding_id: Optional[uuid.UUID] = None


class DocumentUpdate(BaseModel):
    document_type: Optional[str] = Field(None, max_length=100)
    file_name: Optional[str] = Field(None, max_length=255)
    storage_path: Optional[str] = Field(None, max_length=512)
    embedding_id: Optional[uuid.UUID] = None
    is_active: Optional[bool] = None


class DocumentResponse(DocumentBase, AuditSchema):
    employee_id: uuid.UUID
    upload_date: datetime
    embedding_id: Optional[uuid.UUID] = None


class MedicalCertificateResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    employee_name: str
    employee_email: str
    document_type: str
    file_name: str
    storage_path: str
    upload_date: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True
