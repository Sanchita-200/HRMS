import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AuditSchema(BaseModel):
    """
    Subclass interface that response payloads inherit to output tracking details.
    """
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    created_by: Optional[uuid.UUID] = None
    updated_by: Optional[uuid.UUID] = None
    is_active: bool

    # Pydantic v2 configuration to deserialize SQLAlchemy ORM models automatically
    model_config = ConfigDict(from_attributes=True)
