from app.services.base import BaseService
from app.models.hr import Attendance, LeaveType, LeaveRequest
from app.repositories.hr import (
    AttendanceRepository, 
    LeaveTypeRepository, 
    LeaveRequestRepository
)


class AttendanceService(BaseService[Attendance]):
    """
    Service layer logic placeholder for Attendance operations.
    """
    def __init__(self, repository: AttendanceRepository) -> None:
        super().__init__(repository)


class LeaveTypeService(BaseService[LeaveType]):
    """
    Service layer logic placeholder for LeaveType categories.
    """
    def __init__(self, repository: LeaveTypeRepository) -> None:
        super().__init__(repository)


class LeaveRequestService(BaseService[LeaveRequest]):
    """
    Service layer logic placeholder for LeaveRequest workflows.
    """
    def __init__(self, repository: LeaveRequestRepository) -> None:
        super().__init__(repository)
