"""Routers package."""

from .cities import router as cities_router
from .countries import router as countries_router

__all__ = ["cities_router", "countries_router"]
