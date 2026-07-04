from app.repositories.base import BaseRepository
from app.models.payroll import Payroll, SalaryComponent


class PayrollRepository(BaseRepository[Payroll]):
    """
    CRUD Repository layer for Payroll logs.
    """
    def __init__(self) -> None:
        super().__init__(Payroll)


class SalaryComponentRepository(BaseRepository[SalaryComponent]):
    """
    CRUD Repository layer for sub-components (allowances, deductions).
    """
    def __init__(self) -> None:
        super().__init__(SalaryComponent)
