import logging
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.exceptions.custom_exceptions import APIException

logger = logging.getLogger("hrms-exceptions")


async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    """
    Intercepts domain-driven APIException and formats details into unified response.
    """
    if exc.status_code >= 500:
        logger.error(f"System Error at {request.method} {request.url.path} - Msg: {exc.message}", exc_info=True)
    else:
        logger.warning(f"Client Issue at {request.method} {request.url.path} - Msg: {exc.message}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
            "errors": exc.errors,
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Formats Pydantic and FastAPI query/body validation failures.
    """
    errors = []
    for err in exc.errors():
        # loc maps the error path, e.g. ("body", "email")
        loc_path = ".".join(str(path) for path in err.get("loc", []))
        errors.append({
            "field": loc_path,
            "message": err.get("msg"),
            "type": err.get("type")
        })

    logger.warning(f"Validation Error at {request.method} {request.url.path} - Err: {errors}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Input validation checks failed",
            "data": None,
            "errors": errors,
        },
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catches uncaught system errors to prevent raw stack leak.
    """
    logger.error(f"Uncaught Exception at {request.method} {request.url.path} - Err: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected critical server issue occurred",
            "data": None,
            "errors": {"detail": "Internal Server Error"}
        },
    )
