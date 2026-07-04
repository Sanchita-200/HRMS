from app.repositories.base import BaseRepository
from app.models.audit import AuditLog, ActivityLog


class AuditLogRepository(BaseRepository[AuditLog]):
    """
    CRUD Repository layer for tracking database updates.
    """
    def __init__(self) -> None:
        super().__init__(AuditLog)


class ActivityLogRepository(BaseRepository[ActivityLog]):
    """
    CRUD Repository layer for employee performance event tracking logs.
    """
    def __init__(self) -> None:
        super().__init__(ActivityLog)
