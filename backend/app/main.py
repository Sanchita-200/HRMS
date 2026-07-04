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

    # 2. Bootstrap database tables
    from app.database.session import engine
    from app.models import Base
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database metadata schema loaded successfully.")
    except Exception as e:
        logger.critical(f"DATABASE SCHEMA CREATION FAIL: {str(e)}")

    # 3. Seed mock datasets if tables are empty
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        logger.info("Database connection handshake verified successfully.")
        
        from app.models.organization import Department, Designation, Employee
        from app.models.payroll import EmployeeSalaryConfiguration
        import uuid
        from datetime import date
        
        if db.query(Department).count() == 0:
            logger.info("Seeding initial department records...")
            eng_dept = Department(id=uuid.uuid4(), name="Engineering", code="ENG", description="Product development and engineering")
            hr_dept = Department(id=uuid.uuid4(), name="Human Resources", code="HR", description="People operations and recruitment")
            db.add_all([eng_dept, hr_dept])
            db.commit()
            
            logger.info("Seeding initial designation records...")
            eng_desg = Designation(id=uuid.uuid4(), job_title="Staff Frontend Engineer", level="L4", salary_grade="SG4")
            hr_desg = Designation(id=uuid.uuid4(), job_title="HR Specialist", level="L2", salary_grade="SG2")
            db.add_all([eng_desg, hr_desg])
            db.commit()
            
            logger.info("Seeding initial employee records...")
            emp1 = Employee(
                id=uuid.uuid4(),
                employee_number="EMP/2026/001",
                full_name="Sarah Jenkins",
                email="s.jenkins@hrms.com",
                phone="+91 98765 43210",
                address="Flat 402, Sea Breeze Apts, Bandra West, Mumbai, Maharashtra",
                joining_date=date(2022, 4, 12),
                department_id=eng_dept.id,
                designation_id=eng_desg.id,
                gender="Female",
                dob=date(1996, 8, 24),
                emergency_contact="+91 98765 43210 (Spouse)",
                employment_status="active"
            )
            emp2 = Employee(
                id=uuid.uuid4(),
                employee_number="EMP/2026/002",
                full_name="David Kross",
                email="d.kross@hrms.com",
                phone="+91 98123 45678",
                address="123 Pine St, San Francisco, CA",
                joining_date=date(2023, 1, 15),
                department_id=eng_dept.id,
                designation_id=eng_desg.id,
                gender="Male",
                dob=date(1994, 5, 20),
                emergency_contact="+91 98123 45678 (Brother)",
                employment_status="active"
            )
            db.add_all([emp1, emp2])
            db.commit()
            
            logger.info("Seeding initial salary configurations...")
            cfg1 = EmployeeSalaryConfiguration(
                id=uuid.uuid4(),
                employee_id=emp1.id,
                monthly_wage=100000.00,
                working_days_per_week=5,
                working_hours_per_day=8,
                basic_pct=50.00,
                hra_pct=50.00,
                standard_allowance_type="fixed",
                standard_allowance_val=10000.00,
                performance_bonus_type="fixed",
                performance_bonus_val=5000.00,
                lta_type="fixed",
                lta_val=5000.00,
                pf_employee_pct=12.00,
                pf_employer_pct=12.00,
                professional_tax=200.00
            )
            cfg2 = EmployeeSalaryConfiguration(
                id=uuid.uuid4(),
                employee_id=emp2.id,
                monthly_wage=80000.00,
                working_days_per_week=5,
                working_hours_per_day=8,
                basic_pct=50.00,
                hra_pct=50.00,
                standard_allowance_type="fixed",
                standard_allowance_val=8000.00,
                performance_bonus_type="fixed",
                performance_bonus_val=4000.00,
                lta_type="fixed",
                lta_val=3000.00,
                pf_employee_pct=12.00,
                pf_employer_pct=12.00,
                professional_tax=200.00
            )
            db.add_all([cfg1, cfg2])
            db.commit()
            logger.info("Database mock seed completed successfully.")
    except Exception as e:
        logger.critical(f"DATABASE CONFIGURATION/SEED ERROR: {str(e)}")
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

from app.api.v1.endpoints import payroll
app.include_router(payroll.router, prefix="/api/payroll", tags=["Payroll"])


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
