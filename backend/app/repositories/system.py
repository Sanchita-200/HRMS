from app.repositories.base import BaseRepository
from app.models.system import SystemSetting, Notification


class SystemSettingRepository(BaseRepository[SystemSetting]):
    """
    CRUD Repository layer for system configurations.
    """
    def __init__(self) -> None:
        super().__init__(SystemSetting)


class NotificationRepository(BaseRepository[Notification]):
    """
    CRUD Repository layer for system-generated notification logs.
    """
    def __init__(self) -> None:
        super().__init__(Notification)
