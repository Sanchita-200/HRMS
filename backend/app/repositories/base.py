from typing import Any, Generic, List, Optional, Type, TypeVar
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database.session import Base

# Generic Type parameter referencing the SQLAlchemy ORM Base
ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Standard Base Repository pattern wrapping database CRUD transactions
    using SQLAlchemy 2.x declarative statements.
    """
    def __init__(self, model: Type[ModelType]) -> None:
        self.model = model

    def get_by_id(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Retrieves a single model entry by its primary key ID.
        """
        return db.get(self.model, id)

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Retrieves multiple model entries without structured pagination.
        """
        statement = select(self.model).offset(skip).limit(limit)
        return list(db.scalars(statement).all())

    def get_paginated(
        self, db: Session, page: int = 1, size: int = 10
    ) -> tuple[List[ModelType], int]:
        """
        Retrieves multiple model entries with offset/limit pagination calculations.
        Returns a tuple containing: (list_of_items, total_count)
        """
        # Ensure parameters are positive
        page = max(1, page)
        size = max(1, size)
        
        offset = (page - 1) * size
        
        # Select items
        items_stmt = select(self.model).offset(offset).limit(size)
        items = list(db.scalars(items_stmt).all())
        
        # Count total records
        count_stmt = select(func.count()).select_from(self.model)
        total = db.scalar(count_stmt) or 0
        
        return items, total

    def create(self, db: Session, obj_in: Any) -> ModelType:
        """
        Inserts a new model instance and commits the transaction.
        Supports both dictionaries and Pydantic schemas.
        """
        if isinstance(obj_in, dict):
            db_obj = self.model(**obj_in)
        else:
            db_obj = self.model(**obj_in.model_dump())
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: ModelType, obj_in: Any) -> ModelType:
        """
        Updates fields of an existing model instance and commits the transaction.
        Supports both dictionaries and Pydantic schemas.
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Deletes a single model instance by ID and commits the transaction.
        Returns the deleted entry if found, otherwise None.
        """
        db_obj = db.get(self.model, id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj
