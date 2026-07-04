from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Look for env files at both current folder and parent folders
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # General configuration
    APP_NAME: str = "AI-HRMS Core"
    ENVIRONMENT: str = "development"  # e.g., development, staging, production
    DEBUG: bool = True

    # Routing prefix versioning
    API_V1_STR: str = "/api/v1"

    # Database settings
    DATABASE_URL: str = "postgresql://hrms_admin:hrms_secure_password_2026@database:5432/hrms_prod"

    # JWT Authentication configuration
    SECRET_KEY: str = "e6f81a7d6a5d7c3b9b4f5e0a6d2c4e8f0a2d3c5b8e9f1a2b3c4d5e6f7a8b9c0d"
    JWT_SECRET: str = "e6f81a7d6a5d7c3b9b4f5e0a6d2c4e8f0a2d3c5b8e9f1a2b3c4d5e6f7a8b9c0d"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS configuration
    # Can be a JSON-formatted list or comma-separated string
    ALLOWED_ORIGINS: Union[List[str], str] = ["*"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(f"Invalid CORS format: {v}")


settings = Settings()
