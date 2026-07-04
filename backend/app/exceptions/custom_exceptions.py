from typing import Any, Optional


class APIException(Exception):
    """
    Base class for all application custom exceptions.
    """
    def __init__(
        self, 
        status_code: int, 
        message: str, 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.errors = errors


class NotFoundException(APIException):
    def __init__(
        self, 
        message: str = "Requested resource was not found", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=404, message=message, errors=errors)


class ValidationException(APIException):
    def __init__(
        self, 
        message: str = "Request validation check failed", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=422, message=message, errors=errors)


class UnauthorizedException(APIException):
    def __init__(
        self, 
        message: str = "Authentication required or credentials invalid", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=401, message=message, errors=errors)


class ForbiddenException(APIException):
    def __init__(
        self, 
        message: str = "You do not have permission to execute this operation", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=403, message=message, errors=errors)


class ConflictException(APIException):
    def __init__(
        self, 
        message: str = "Resource conflict occurred", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=409, message=message, errors=errors)


class InternalServerException(APIException):
    def __init__(
        self, 
        message: str = "An unexpected error occurred internally", 
        errors: Optional[Any] = None
    ) -> None:
        super().__init__(status_code=500, message=message, errors=errors)
