import logging
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.dependencies.db import get_db
from app.schemas.responses import ApiResponse
from app.utils.constants import SystemConstants

logger = logging.getLogger("hrms-system-api")
router = APIRouter()


@router.get("/health", response_model=ApiResponse[dict])
def health_check(db: Session = Depends(get_db)) -> ApiResponse:
    """
    Checks backend application status and PostgreSQL database connection ping.
    """
    db_connected = False
    message = "System health check failed"
    
    try:
        # Perform low-level connection validation execution query
        db.execute(text("SELECT 1"))
        db_connected = True
        message = "System is fully functional and healthy"
    except Exception as e:
        logger.error(f"Health check failed database ping: {str(e)}")
        message = f"Database connection issue: {str(e)}"
        
    return ApiResponse(
        success=db_connected,
        message=message,
        data={
            "database_connected": db_connected,
            "api_online": True
        }
    )


@router.get("/version", response_model=ApiResponse[dict])
def version_check() -> ApiResponse:
    """
    Returns running application versions metadata.
    """
    return ApiResponse(
        success=True,
        message="Application version retrieved successfully",
        data={
            "version": SystemConstants.APP_VERSION,
            "author": SystemConstants.SYSTEM_AUTHOR,
            "environment": settings.ENVIRONMENT
        }
    )


@router.get("/status", response_model=ApiResponse[dict])
def status_check(db: Session = Depends(get_db)) -> ApiResponse:
    """
    Provides comprehensive service metrics status logs.
    """
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        pass
        
    status_label = "online" if db_connected else "degraded"
    
    return ApiResponse(
        success=True,
        message="Telemetry status checks completed",
        data={
            "status": status_label,
            "environment": settings.ENVIRONMENT,
            "debug_mode": settings.DEBUG,
            "modules": {
                "authentication": "pending",
                "employee_crud": "pending",
                "attendance": "pending",
                "payroll": "pending",
                "ai_assistant": "pending"
            }
        }
    )
