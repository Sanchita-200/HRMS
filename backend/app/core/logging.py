import logging
import sys
from contextvars import ContextVar

# ContextVar to propagate correlation Request IDs through async tasks
request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")


class RequestIdFilter(logging.Filter):
    """
    Injects request_id context variable into logging records dynamically.
    """
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get()
        return True


def setup_logging() -> None:
    """
    Configures standard Python logging to output structured logs with 
    timestamp, log level, logger name, request context, and the message body.
    """
    log_format = "%(asctime)s [%(levelname)s] (%(name)s) [ReqID: %(request_id)s] - %(message)s"
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing default handler configurations
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    # Set up console handler (stdout)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(log_format))
    handler.addFilter(RequestIdFilter())
    
    root_logger.addHandler(handler)
    
    # Reduce logs level for chatty dependencies
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("alembic").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
