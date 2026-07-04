from app.services.base import BaseService
from app.models.auth import Permission, Role, User, Session
from app.repositories.auth import (
    PermissionRepository, 
    RoleRepository, 
    UserRepository, 
    SessionRepository
)


class PermissionService(BaseService[Permission]):
    """
    Service layer logic placeholder for Permission operations.
    """
    def __init__(self, repository: PermissionRepository) -> None:
        super().__init__(repository)


class RoleService(BaseService[Role]):
    """
    Service layer logic placeholder for Role operations.
    """
    def __init__(self, repository: RoleRepository) -> None:
        super().__init__(repository)


class UserService(BaseService[User]):
    """
    Service layer logic placeholder for User account operations.
    """
    def __init__(self, repository: UserRepository) -> None:
        super().__init__(repository)


class SessionService(BaseService[Session]):
    """
    Service layer logic placeholder for Session operations.
    """
    def __init__(self, repository: SessionRepository) -> None:
        super().__init__(repository)
