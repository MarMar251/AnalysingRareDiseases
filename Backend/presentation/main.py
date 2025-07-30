from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer

from presentation.api.v1 import users, patients, diseases, patient_diseases, classification


# ─────────────────────────────  Auth scheme in OpenAPI  ───────────────────
bearer_scheme = HTTPBearer()  # keep default scheme_name "HTTPBearer"


def custom_openapi():
    """
    Attach the same HTTPBearer requirement to every endpoint without
    losing the default schema FastAPI generates.
    """
    if app.openapi_schema:            
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Clinical-API",
        version="1.0.0",
        description="Backend powered by Clean Architecture + JWT auth",
        routes=app.routes,
    )

    # ensure HTTPBearer exists in components
    openapi_schema.setdefault("components", {}).setdefault(
        "securitySchemes",
        {},
    ).setdefault(
        "HTTPBearer",
        {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"},
    )

    # add the scheme to every operation
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation["security"] = [{"HTTPBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# ─────────────────────────────  FastAPI app  ──────────────────────────────
app = FastAPI()
app.openapi = custom_openapi  

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────  Startup Events  ────────────────────────────
@app.on_event("startup")
def initialize_models():
    """Initialize ML models on application startup"""
    import logging
    from presentation.di import get_uow
    
    logger = logging.getLogger("app.startup")
    logger.info("Initializing ML models...")
    
    # Get unit of work to access repositories
    uow = get_uow()
    
    # Initialize classification repository model
    uow.classification.initialize_model()
    
    logger.info("ML models initialization complete")

# ─────────────────────────────  Routers  ──────────────────────────────────
api_prefix = "/api/v1"
app.include_router(users.router, prefix=api_prefix)
app.include_router(patients.router, prefix=api_prefix)
app.include_router(diseases.router, prefix=api_prefix)
app.include_router(patient_diseases.router, prefix=api_prefix)
app.include_router(classification.router, prefix=api_prefix)
