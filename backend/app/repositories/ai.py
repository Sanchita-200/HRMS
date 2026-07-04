from app.repositories.base import BaseRepository
from app.models.ai import AIConversation, AIEmbedding


class AIConversationRepository(BaseRepository[AIConversation]):
    """
    CRUD Repository layer for dynamic AI assistant conversations histories.
    """
    def __init__(self) -> None:
        super().__init__(AIConversation)


class AIEmbeddingRepository(BaseRepository[AIEmbedding]):
    """
    CRUD Repository layer for Document vector embeddings parameters.
    """
    def __init__(self) -> None:
        super().__init__(AIEmbedding)
