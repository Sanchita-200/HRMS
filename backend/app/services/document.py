from app.services.base import BaseService
from app.models.document import Document
from app.repositories.document import DocumentRepository


class DocumentService(BaseService[Document]):
    """
    Service layer logic placeholder for Employee Document storage.
    """
    def __init__(self, repository: DocumentRepository) -> None:
        super().__init__(repository)
