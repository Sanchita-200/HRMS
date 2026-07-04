# AI-HRMS Backend - FastAPI

This is the FastAPI backend for the AI-Powered Human Resource Management System (AI-HRMS).

## Technology Stack

- **Framework:** FastAPI
- **Python Version:** 3.12+
- **ORM:** SQLAlchemy 2.0+
- **Migrations:** Alembic
- **Formatting & Linting:** Ruff
- **AI Integrations:** LangChain, LangGraph, Ollama, ChromaDB

## Clean Architecture Directory Structure

The backend directory structure strictly isolates code concerns:

- `/app/api`: HTTP endpoints, validation route definitions, and parameter extraction. No business logic.
- `/app/core`: Application config settings, JWT authentication tokens logic, and logger configurations.
- `/app/database`: Database session builders and connection logic.
- `/app/models`: SQLAlchemy ORM structural mapping definitions.
- `/app/schemas`: Pydantic request-validation and serialization models.
- `/app/repositories`: Data Access Object (DAO) patterns encapsulating CRUD.
- `/app/services`: Pure business rules execution.
- `/app/middlewares`: Request interceptors (CORS rules, rate limiting, request tracing).
- `/app/utils`: System helpers.
- `/app/ai`: Core modules for AI features.
  - `/ai/agents`: Complex decision workflows created using LangGraph.
  - `/ai/rag`: Semantic file parsing, ingestion pipelines, text splitters.
  - `/ai/prompts`: Prompt engineering systems templates.
  - `/ai/vectorstore`: ChromaDB vector database bindings.

## Local Installation

Ensure Python 3.12+ is installed on your local computer.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload --port 8000
```

The API endpoints will be visible at `http://localhost:8000`, and the OpenAPI schemas will load at `http://localhost:8000/docs`.

## Database Migrations

Use Alembic commands for database schemas. Since migrations live in the monorepo `/database/migrations` directory, alembic.ini is configured relative to that:

```bash
# Run migrations to the latest revision
alembic upgrade head

# Generate a new migration script
alembic revision --autogenerate -m "Add employee table"
```
