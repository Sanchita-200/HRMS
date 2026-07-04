from app.services.base import BaseService
from app.models.audit import AuditLog, ActivityLog
from app.repositories.audit import (
    AuditLogRepository, 
    ActivityLogRepository
)


class AuditLogService(BaseService[AuditLog]):
    """
    Service layer logic placeholder for system AuditLogs.
    """
    def __init__(self, repository: AuditLogRepository) -> None:
        super().__init__(repository)


class ActivityLogService(BaseService[ActivityLog]):
    """
    Service layer logic placeholder for employee lifecycle ActivityLogs.
    """
    def __init__(self, repository: ActivityLogRepository) -> None:
        super().__init__(repository)
