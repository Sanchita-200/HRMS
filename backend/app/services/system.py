from app.services.base import BaseService
from app.models.system import SystemSetting, Notification
from app.repositories.system import (
    SystemSettingRepository, 
    NotificationRepository
)


class SystemSettingService(BaseService[SystemSetting]):
    """
    Service layer logic placeholder for System Settings adjustments.
    """
    def __init__(self, repository: SystemSettingRepository) -> None:
        super().__init__(repository)


class NotificationService(BaseService[Notification]):
    """
    Service layer logic placeholder for system alerts dispatch.
    """
    def __init__(self, repository: NotificationRepository) -> None:
        super().__init__(repository)
