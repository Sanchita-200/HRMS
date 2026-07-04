import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from app.core.logging import request_id_ctx


class RequestIdMiddleware(BaseHTTPMiddleware):
    """
    Middleware that reads or generates a correlation Request ID per request.
    This ID is stored in a ContextVar for logging and returned in response headers.
    """
    async def dispatch(
        self, 
        request: Request, 
        call_next: RequestResponseEndpoint
    ) -> Response:
        # Check header for incoming trace IDs or generate a new UUID
        request_id = (
            request.headers.get("X-Request-ID") or 
            request.headers.get("X-Correlation-ID") or 
            str(uuid.uuid4())
        )
        
        # Bind the trace ID to ContextVar for this request execution path
        token = request_id_ctx.set(request_id)
        
        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            # Always reset ContextVar when execution thread leaves the request scope
            request_id_ctx.reset(token)
