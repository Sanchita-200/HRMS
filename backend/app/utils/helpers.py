import math
from datetime import datetime, timezone
from typing import Any, List, Optional
from app.schemas.responses import PaginatedData


def utc_now() -> datetime:
    """
    Returns timezone-aware current UTC datetime.
    """
    return datetime.now(timezone.utc)


def format_iso(dt: datetime) -> str:
    """
    Formats a datetime object to ISO-8601 string.
    """
    return dt.isoformat()


def parse_iso(iso_str: str) -> Optional[datetime]:
    """
    Parses an ISO-8601 string to a datetime object. Returns None if invalid.
    """
    try:
        return datetime.fromisoformat(iso_str)
    except ValueError:
        return None


def create_paginated_data(
    items: List[Any],
    total: int,
    page: int,
    size: int
) -> PaginatedData[Any]:
    """
    Encapsulates list data and database total records to compute pagination metadata
    like total pages.
    """
    # Defensive math
    page = max(1, page)
    size = max(1, size)
    
    total_pages = math.ceil(total / size) if size > 0 else 0
    
    return PaginatedData(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=total_pages
    )
