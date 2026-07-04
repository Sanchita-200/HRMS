from app.services.base import BaseService
from app.models.ai import AIConversation, AIEmbedding
from app.repositories.ai import (
    AIConversationRepository, 
    AIEmbeddingRepository
)


class AIConversationService(BaseService[AIConversation]):
    """
    Service layer logic placeholder for conversational LLM chat operations.
    """
    def __init__(self, repository: AIConversationRepository) -> None:
        super().__init__(repository)


class AIEmbeddingService(BaseService[AIEmbedding]):
    """
    Service layer logic placeholder for vector search operations.
    """
    def __init__(self, repository: AIEmbeddingRepository) -> None:
        super().__init__(repository)
