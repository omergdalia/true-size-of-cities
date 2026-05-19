"""Pydantic schemas for API responses."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel

# ── GeoJSON primitives ────────────────────────────────────────────────────────

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any


class CountryProperties(BaseModel):
    code: str
    name: str
    capital: str


class CityProperties(BaseModel):
    id: str
    name: str
    country: str
    country_code: str
    lon: float
    lat: float
    urban_radius_km: float
    area_km2: int


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    id: str | None = None
    properties: dict[str, Any]
    geometry: GeoJSONGeometry


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    name: str | None = None
    features: list[GeoJSONFeature]


# ── Summary models (list endpoints) ──────────────────────────────────────────

class CountrySummary(BaseModel):
    code: str
    name: str
    capital: str


class CitySummary(BaseModel):
    id: str
    name: str
    country: str
    country_code: str
    lat: float
    lon: float
    urban_radius_km: float
    area_km2: int
