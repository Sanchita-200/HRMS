from typing import Generator
from sqlalchemy.orm import Session
from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Yields a thread-scoped database session.
    Automatically closes session connections upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
