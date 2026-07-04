import os
import socket
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL
engine = None

# Attempt PostgreSQL connectivity check
try:
    if "postgresql" in db_url:
        # Parse host and port from URL: postgresql://user:pass@host:port/db
        parts = db_url.split("@")[1].split("/")[0]
        if ":" in parts:
            host, port = parts.split(":")
            port = int(port)
        else:
            host = parts
            port = 5432
            
        # Socket test to verify DB server is listening
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)
        s.connect((host, port))
        s.close()
        
        # Connect to PostgreSQL with full connection pool settings
        engine = create_engine(
            db_url,
            pool_size=10,
            max_overflow=20,
            pool_recycle=1800,
            pool_pre_ping=True,
            echo=False
        )
    else:
        raise ValueError("Non-PostgreSQL URL configured.")
except Exception:
    # Graceful fallback to SQLite database file in the backend directory
    db_url = "sqlite:///hrms.db"
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
