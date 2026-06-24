from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1 import auth, contracts, reviews, annotations, approvals
from app.models import *  # noqa: F401

settings = get_settings()

Base.metadata.create_all(bind=engine)

# Seed default demo users in production on first startup
from seed import seed  # noqa: E402

seed()

app = FastAPI(
    title="智能合同审核系统 API",
    description="面向企业内部的一体化合同审核工作流平台",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[url.strip() for url in settings.frontend_url.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(contracts.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(annotations.router, prefix="/api/v1")
app.include_router(approvals.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "智能合同审核系统 API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {"status": "ok"}
