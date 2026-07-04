import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

logger = logging.getLogger("hrms-requests")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware tracking request entry, exit status, execution durations,
    and client host parameters.
    """
    async def dispatch(
        self, 
        request: Request, 
        call_next: RequestResponseEndpoint
    ) -> Response:
        start_time = time.perf_counter()
        client_host = request.client.host if request.client else "unknown"
        
        logger.info(
            f"HTTP Request: {request.method} {request.url.path} from client {client_host}"
        )
        
        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            
            # Add trace timing header
            response.headers["X-Process-Time-Ms"] = f"{duration_ms:.2f}"
            
            logger.info(
                f"HTTP Response: {request.method} {request.url.path} "
                f"Status: {response.status_code} "
                f"Duration: {duration_ms:.2f}ms"
            )
            return response
            
        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"HTTP Exception: {request.method} {request.url.path} "
                f"Err: {str(e)} "
                f"Duration: {duration_ms:.2f}ms"
            )
            # Re-raise to let global exception handlers format the response
            raise e
