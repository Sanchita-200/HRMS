from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Create engine with production-ready connection pool configuration
# pool_size: Number of connections to keep open inside the pool
# max_overflow: Allow extra connections beyond pool_size under peak loads
# pool_recycle: Recycles connections older than 30 minutes to prevent stale DB sockets
# pool_pre_ping: Validates connection health before issuing SQL queries
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800,
    pool_pre_ping=True,
    echo=False
)

# Session factory for scope transactions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Declarative base class for SQLAlchemy model structures mapping
Base = declarative_base()
