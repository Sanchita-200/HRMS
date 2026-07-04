from app.repositories.base import BaseRepository
from app.models.auth import Permission, Role, User, Session


class PermissionRepository(BaseRepository[Permission]):
    """
    CRUD Repository layer for system granular Permissions.
    """
    def __init__(self) -> None:
        super().__init__(Permission)


class RoleRepository(BaseRepository[Role]):
    """
    CRUD Repository layer for system Roles.
    """
    def __init__(self) -> None:
        super().__init__(Role)


class UserRepository(BaseRepository[User]):
    """
    CRUD Repository layer for User accounts.
    """
    def __init__(self) -> None:
        super().__init__(User)


class SessionRepository(BaseRepository[Session]):
    """
    CRUD Repository layer for active sessions and refresh tokens.
    """
    def __init__(self) -> None:
        super().__init__(Session)
