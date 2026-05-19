"""FastAPI application entry point."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import cities_router, countries_router

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "API serving GeoJSON boundaries for countries and capital-city urban areas, "
        "enabling the True Size of Cities comparison experience."
    ),
)

# Allow the Vite dev-server and production origins to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cities_router, prefix=settings.api_prefix)
app.include_router(countries_router, prefix=settings.api_prefix)


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {
        "message": "True Size of Cities API",
        "docs": "/docs",
        "version": settings.app_version,
    }


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
