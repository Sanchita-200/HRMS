from app.repositories.base import BaseRepository
from app.models.document import Document


class DocumentRepository(BaseRepository[Document]):
    """
    CRUD Repository layer for employee uploaded Document structures.
    """
    def __init__(self) -> None:
        super().__init__(Document)
