from typing import Any, Generic, List, Optional, TypeVar
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository

ModelType = TypeVar("ModelType")


class BaseService(Generic[ModelType]):
    """
    Standard base service layer encapsulating data access repositories.
    Ensures routes delegate business processing to services instead of repositories directly.
    """
    def __init__(self, repository: BaseRepository[ModelType]) -> None:
        self.repository = repository

    def get_by_id(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Fetches an entity by its primary ID.
        """
        return self.repository.get_by_id(db, id)

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Fetches all entities in range offset.
        """
        return self.repository.get_all(db, skip=skip, limit=limit)

    def get_paginated(
        self, db: Session, page: int = 1, size: int = 10
    ) -> tuple[List[ModelType], int]:
        """
        Fetches structured pagination entries.
        """
        return self.repository.get_paginated(db, page=page, size=size)

    def create(self, db: Session, obj_in: Any) -> ModelType:
        """
        Registers a new database record.
        """
        return self.repository.create(db, obj_in)

    def update(self, db: Session, db_obj: ModelType, obj_in: Any) -> ModelType:
        """
        Applies updates to an existing database record.
        """
        return self.repository.update(db, db_obj, obj_in)

    def delete(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Removes a database record.
        """
        return self.repository.delete(db, id)
