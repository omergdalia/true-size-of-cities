"""Countries router."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.data_loader import get_countries_collection
from app.schemas import CountrySummary, GeoJSONFeature, GeoJSONFeatureCollection

router = APIRouter(prefix="/countries", tags=["countries"])


@router.get("", response_model=list[CountrySummary])
def list_countries() -> list[CountrySummary]:
    """Return a summary list of all available countries."""
    collection = get_countries_collection()
    return [
        CountrySummary(**f["properties"])
        for f in collection["features"]
    ]


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def countries_geojson() -> GeoJSONFeatureCollection:
    """Return the full FeatureCollection for all countries."""
    return GeoJSONFeatureCollection(**get_countries_collection())


@router.get("/{code}", response_model=GeoJSONFeature)
def get_country(code: str) -> GeoJSONFeature:
    """Return a single country Feature by ISO-3166-1 alpha-2 code."""
    code = code.upper()
    collection = get_countries_collection()
    for feature in collection["features"]:
        if feature["properties"]["code"] == code:
            return GeoJSONFeature(**feature)
    raise HTTPException(status_code=404, detail=f"Country '{code}' not found.")
