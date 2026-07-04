from contextlib import asynccontextmanager
import logging
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.dependencies.db import get_db

# Custom exceptions and handlers
from app.exceptions.custom_exceptions import APIException
from app.exceptions.handlers import (
    api_exception_handler,
    global_exception_handler,
    validation_exception_handler,
)

# Middlewares
from app.middlewares.logging import RequestLoggingMiddleware
from app.middlewares.request_id import RequestIdMiddleware

# Database session builders
from app.database.session import SessionLocal

logger = logging.getLogger("hrms-main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages application startup and shutdown lifecycles.
    """
    # 1. Initialize logging
    setup_logging()
    logger.info("Initializing AI-HRMS Backend System...")
    logger.info(f"Environment: {settings.ENVIRONMENT} | Debug Mode: {settings.DEBUG}")

    # 2. Validate database connectivity
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        logger.info("Database connection handshake verified successfully.")
    except Exception as e:
        logger.critical(f"DATABASE CONNECTION FAIL ON STARTUP: {str(e)}")
    finally:
        db.close()

    yield

    logger.info("Shutting down AI-HRMS Backend System...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise API Core Backend for AI-Powered Human Resource Management System.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# --- Register Global Exception Handlers ---
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# --- Register Middlewares ---
# Executed in reverse order of addition for response path, standard order for request
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RequestIdMiddleware)

# Configure CORS
# Converts single '*' or specific list items to browser rules
origins = (
    [settings.ALLOWED_ORIGINS] 
    if isinstance(settings.ALLOWED_ORIGINS, str) 
    else settings.ALLOWED_ORIGINS
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Versioned Routers ---
app.include_router(api_router, prefix=settings.API_V1_STR)


# --- Root Level Diagnostics Endpoints ---
@app.get("/", tags=["System"])
async def root_index():
    return {
        "message": f"Welcome to the {settings.APP_NAME} core API service",
        "version": "1.0.0",
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_STR,
    }


# Root level redirects/duplicates of the v1 system telemetry checks
from app.api.v1.endpoints.system import health_check, status_check, version_check


@app.get("/health", tags=["System"])
def root_health(db: Session = Depends(get_db)):
    return health_check(db)


@app.get("/version", tags=["System"])
def root_version():
    return version_check()


@app.get("/status", tags=["System"])
def root_status(db: Session = Depends(get_db)):
    return status_check(db)
