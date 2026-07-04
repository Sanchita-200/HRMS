# Import all database models for registry mapping
from app.database.session import Base
from app.models.base import AuditMixin
from app.models.auth import Permission, Role, User, Session, role_permissions
from app.models.organization import Department, Designation, Employee
from app.models.hr import Attendance, LeaveType, LeaveRequest
from app.models.payroll import Payroll, SalaryComponent, EmployeeSalaryConfiguration, SalaryAuditLog
from app.models.document import Document
from app.models.ai import AIConversation, AIEmbedding
from app.models.audit import AuditLog, ActivityLog
from app.models.system import SystemSetting, Notification

__all__ = [
    "Base",
    "AuditMixin",
    "Permission",
    "Role",
    "User",
    "Session",
    "role_permissions",
    "Department",
    "Designation",
    "Employee",
    "Attendance",
    "LeaveType",
    "LeaveRequest",
    "Payroll",
    "SalaryComponent",
    "EmployeeSalaryConfiguration",
    "SalaryAuditLog",
    "Document",
    "AIConversation",
    "AIEmbedding",
    "AuditLog",
    "ActivityLog",
    "SystemSetting",
    "Notification",
]
