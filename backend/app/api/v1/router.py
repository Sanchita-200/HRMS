from fastapi import APIRouter
from app.api.v1.endpoints import system

api_router = APIRouter()

# Mount system checks
api_router.include_router(system.router, prefix="/system", tags=["System"])
