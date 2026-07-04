# Backend Architectural Design Manual - AI-HRMS

This document outlines the architecture, structural layers, request lifecycles, and database transaction rules of the **AI-HRMS** backend platform.

---

## 🏛 Clean Architecture Directory Layout

The application code is strictly separated into layers. The dependency flow moves **inward**: outer layers can import from inner layers, but inner layers must never import or depend on outer layers.

```
backend/app/
├── api/             # Layer 1: HTTP Controllers & Route Endpoints
│   └── v1/          # Version 1 API endpoint namespaces
├── core/            # Config, logger, global environment settings
├── database/        # Database engines & transaction session creators
├── dependencies/    # FastAPI Dependency Injection provider functions
├── exceptions/      # System custom exceptions and error mapping handlers
├── middlewares/     # HTTP interceptors (CORS, Request IDs, timing logs)
├── models/          # Layer 4: SQLAlchemy DB Declarative schemas
├── repositories/    # Layer 3: Data Access Layer (SQL queries encapsulation)
├── schemas/         # Request input serializers & response descriptors (Pydantic)
├── services/        # Layer 2: Core Domain Business Logic
└── utils/           # Time conversions, cryptography helpers, string constants
```

### Layer Responsibilities

| Layer Name | Location | Primary Responsibilities | Allowed Imports |
| :--- | :--- | :--- | :--- |
| **HTTP API Controllers** | `app/api/` | HTTP parameter extraction, request routing, validation triggers, status code serialization. | `app/services/`, `app/schemas/`, `app/dependencies/` |
| **Business Services** | `app/services/` | Evaluates business logic constraints, processes state transitions, triggers notifications. | `app/repositories/`, `app/models/`, `app/schemas/` |
| **Data Repositories** | `app/repositories/` | Direct SQL generation (SQLAlchemy statements), database CRUD, queries optimization. | `app/models/`, `app/database/` |
| **Domain Models & Schemas** | `app/models/` & `app/schemas/` | Data entity structures (declarative tables) and Pydantic serialization definitions. | Standard python types, Pydantic helpers. |

---

## 🔄 HTTP Request Execution Lifecycle

When an API client makes a request, it flows through the following pipeline:

```mermaid
sequenceDiagram
    autoflow on
    Client->>RequestIdMiddleware: 1. Inject/Read X-Request-ID Header
    RequestIdMiddleware->>RequestLoggingMiddleware: 2. Capture Start Time & Log Path
    RequestLoggingMiddleware->>FastAPI Router: 3. Dispatch to API Router
    FastAPI Router->>DB Dependency: 4. Resolve get_db sessionmaker
    DB Dependency->>Auth Dependency: 5. Decode JWT claims & Roles
    Auth Dependency->>API Route Controller: 6. Run Controller Handler
    API Route Controller->>Business Service: 7. Invoke Service Method (pass DB session)
    Business Service->>Data Repository: 8. Query database
    Data Repository->>PostgreSQL: 9. Execute SQL Statement
    PostgreSQL-->>Data Repository: 10. Return database tuples
    Data Repository-->>Business Service: 11. Return ORM Instance
    Business Service-->>API Route Controller: 12. Evaluate rules & return DTO schemas
    API Route Controller-->>RequestLoggingMiddleware: 13. Serialize to standard ApiResponse
    RequestLoggingMiddleware-->>RequestIdMiddleware: 14. Calculate duration, log metrics
    RequestIdMiddleware-->>Client: 15. Return JSON payload + X-Request-ID header
```

### Exception Path
If an exception occurs at any point in the pipeline (e.g. database disconnect, authentication error, Pydantic validation failure):
1. Execution halts and bubble up to the FastAPI exception handlers registered in `backend/app/main.py`.
2. The exception handlers format the error into a unified JSON format (success=False, error details).
3. The response returns with the corresponding HTTP status code (e.g., 404, 422, 500), and the timing middleware still records and prints the latency.

---

## 💾 Database Session & Transaction Lifecycle

To prevent transaction locks and memory leakage, database connections must be managed with care:

1. **Request-Scoped Session (`get_db`):** A unique SQLAlchemy `Session` is initialized on demand when a route references `db: Session = Depends(get_db)`.
2. **Transaction Propagation:** The `db` session object is passed down as a parameter from the Route Controller to the Service Layer, and finally to the Repository. This ensures that all database operations carried out during a single HTTP request reuse the same connection and run under the same transaction context.
3. **Automatic Closure:** When the request completes (either by returning a response or raising an exception), FastAPI's dependency injection system executes the cleanup generator code inside `get_db`. The session session connection is closed and returned back to the connection pool.
