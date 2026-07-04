from app.services.base import BaseService
from app.models.payroll import Payroll, SalaryComponent
from app.repositories.payroll import (
    PayrollRepository, 
    SalaryComponentRepository
)


class PayrollService(BaseService[Payroll]):
    """
    Service layer logic placeholder for Payroll calculations.
    """
    def __init__(self, repository: PayrollRepository) -> None:
        super().__init__(repository)


class SalaryComponentService(BaseService[SalaryComponent]):
    """
    Service layer logic placeholder for individual salary component entries.
    """
    def __init__(self, repository: SalaryComponentRepository) -> None:
        super().__init__(repository)
