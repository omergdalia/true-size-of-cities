"""Cities router."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.data_loader import get_cities_collection
from app.schemas import CitySummary, GeoJSONFeature, GeoJSONFeatureCollection

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("", response_model=list[CitySummary])
def list_cities(
    country_code: str | None = Query(default=None, description="Filter by ISO country code"),
) -> list[CitySummary]:
    """Return a summary list of all capital cities, optionally filtered by country."""
    collection = get_cities_collection()
    features = collection["features"]
    if country_code:
        code = country_code.upper()
        features = [f for f in features if f["properties"]["country_code"] == code]
    return [CitySummary(**f["properties"]) for f in features]


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def cities_geojson(
    country_code: str | None = Query(default=None, description="Filter by ISO country code"),
) -> GeoJSONFeatureCollection:
    """Return the full FeatureCollection for all cities (optionally filtered)."""
    collection = get_cities_collection()
    features = collection["features"]
    if country_code:
        code = country_code.upper()
        features = [f for f in features if f["properties"]["country_code"] == code]
    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        name="capital_cities",
        features=features,
    )


@router.get("/{city_id}", response_model=GeoJSONFeature)
def get_city(city_id: str) -> GeoJSONFeature:
    """Return a single city Feature by its slug ID."""
    collection = get_cities_collection()
    for feature in collection["features"]:
        if feature["properties"]["id"] == city_id:
            return GeoJSONFeature(**feature)
    raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
