from __future__ import annotations

import json
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.document import Document
from app.models.organization import Employee
from app.schemas.document import MedicalCertificateResponse

router = APIRouter()

BACKEND_ROOT = Path(__file__).resolve().parents[4]
CERTIFICATE_STORAGE_DIR = BACKEND_ROOT / "storage" / "medical-certificates"
CERTIFICATE_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def _resolve_employee(db: Session, employee_identifier: str) -> Employee:
    employee = (
        db.query(Employee)
        .filter((Employee.employee_number == employee_identifier) | (Employee.email == employee_identifier))
        .first()
    )
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee record not found")
    return employee


def _metadata_path(storage_path: Path) -> Path:
    return storage_path.with_suffix(".json")


def _serialize_certificate(document: Document, notes: Optional[str] = None) -> MedicalCertificateResponse:
    employee = document.employee
    return MedicalCertificateResponse(
        id=document.id,
        employee_id=document.employee_id,
        employee_name=employee.full_name if employee else "Unknown Employee",
        employee_email=employee.email if employee else "",
        document_type=document.document_type,
        file_name=document.file_name,
        storage_path=document.storage_path,
        upload_date=document.upload_date,
        notes=notes,
    )


@router.post("/medical-certificates", response_model=MedicalCertificateResponse, status_code=status.HTTP_201_CREATED)
async def upload_medical_certificate(
    employee_identifier: str = Form(...),
    notes: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> MedicalCertificateResponse:
    employee = _resolve_employee(db, employee_identifier)

    original_name = Path(file.filename or "medical-certificate").name
    stored_name = f"{uuid.uuid4()}_{original_name}"
    storage_relative = Path("storage") / "medical-certificates" / stored_name
    storage_absolute = BACKEND_ROOT / storage_relative

    with storage_absolute.open("wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)

    metadata_path = _metadata_path(storage_absolute)
    metadata_path.write_text(
        json.dumps(
            {
                "employee_identifier": employee_identifier,
                "notes": notes,
                "original_file_name": original_name,
                "stored_file_name": stored_name,
            },
            ensure_ascii=True,
            indent=2,
        ),
        encoding="utf-8",
    )

    document = Document(
        id=uuid.uuid4(),
        employee_id=employee.id,
        document_type="medical_certificate",
        file_name=original_name,
        storage_path=str(storage_relative.as_posix()),
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    return _serialize_certificate(document, notes=notes)


@router.get("/medical-certificates", response_model=list[MedicalCertificateResponse])
def list_medical_certificates(
    employee_identifier: Optional[str] = None,
    db: Session = Depends(get_db),
) -> list[MedicalCertificateResponse]:
    query = db.query(Document).filter(Document.document_type == "medical_certificate")

    if employee_identifier:
        employee = _resolve_employee(db, employee_identifier)
        query = query.filter(Document.employee_id == employee.id)

    documents = query.order_by(Document.upload_date.desc()).all()
    certificates: list[MedicalCertificateResponse] = []

    for document in documents:
        storage_absolute = BACKEND_ROOT / document.storage_path
        notes = None
        metadata_path = _metadata_path(storage_absolute)
        if metadata_path.exists():
            try:
                notes = json.loads(metadata_path.read_text(encoding="utf-8")).get("notes")
            except Exception:
                notes = None
        certificates.append(_serialize_certificate(document, notes=notes))

    return certificates