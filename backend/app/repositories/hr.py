from app.repositories.base import BaseRepository
from app.models.hr import Attendance, LeaveType, LeaveRequest


class AttendanceRepository(BaseRepository[Attendance]):
    """
    CRUD Repository layer for employee daily Attendance logs.
    """
    def __init__(self) -> None:
        super().__init__(Attendance)


class LeaveTypeRepository(BaseRepository[LeaveType]):
    """
    CRUD Repository layer for Leave categories.
    """
    def __init__(self) -> None:
        super().__init__(LeaveType)


class LeaveRequestRepository(BaseRepository[LeaveRequest]):
    """
    CRUD Repository layer for Leave requests.
    """
    def __init__(self) -> None:
        super().__init__(LeaveRequest)
