from app.repositories.base import BaseRepository
from app.models.organization import Department, Designation, Employee


class DepartmentRepository(BaseRepository[Department]):
    """
    CRUD Repository layer for Departments.
    """
    def __init__(self) -> None:
        super().__init__(Department)


class DesignationRepository(BaseRepository[Designation]):
    """
    CRUD Repository layer for job Designations.
    """
    def __init__(self) -> None:
        super().__init__(Designation)


class EmployeeRepository(BaseRepository[Employee]):
    """
    CRUD Repository layer for Employee profiles.
    """
    def __init__(self) -> None:
        super().__init__(Employee)
