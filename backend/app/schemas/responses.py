from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

# Generic Type parameter to represent resource models serialized in 'data' field
T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """
    Standard HTTP response envelope returned by all routers.
    """
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[Any] = None


class PaginatedData(BaseModel, Generic[T]):
    """
    Standard pagination metadata structure.
    """
    items: list[T]
    total: int
    page: int
    size: int
    pages: int


class PaginatedResponse(ApiResponse[PaginatedData[T]]):
    """
    Standard envelope enclosing a paginated list resource.
    """
    pass
