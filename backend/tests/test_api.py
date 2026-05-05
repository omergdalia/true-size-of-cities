"""API endpoint tests."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ── Health ────────────────────────────────────────────────────────────────────

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data


# ── Countries ─────────────────────────────────────────────────────────────────

def test_list_countries():
    response = client.get("/api/v1/countries")
    assert response.status_code == 200
    countries = response.json()
    assert isinstance(countries, list)
    assert len(countries) > 0
    first = countries[0]
    assert "code" in first
    assert "name" in first
    assert "capital" in first


def test_countries_geojson():
    response = client.get("/api/v1/countries/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0
    feature = data["features"][0]
    assert feature["type"] == "Feature"
    assert feature["geometry"]["type"] == "Polygon"


def test_get_country_by_code():
    response = client.get("/api/v1/countries/GB")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "Feature"
    assert data["properties"]["code"] == "GB"
    assert data["properties"]["name"] == "United Kingdom"


def test_get_country_case_insensitive():
    response = client.get("/api/v1/countries/gb")
    assert response.status_code == 200
    assert response.json()["properties"]["code"] == "GB"


def test_get_country_not_found():
    response = client.get("/api/v1/countries/ZZ")
    assert response.status_code == 404


# ── Cities ────────────────────────────────────────────────────────────────────

def test_list_cities():
    response = client.get("/api/v1/cities")
    assert response.status_code == 200
    cities = response.json()
    assert isinstance(cities, list)
    assert len(cities) > 0
    first = cities[0]
    assert "id" in first
    assert "name" in first
    assert "country_code" in first
    assert "urban_radius_km" in first
    assert "area_km2" in first


def test_list_cities_filter_by_country():
    response = client.get("/api/v1/cities?country_code=GB")
    assert response.status_code == 200
    cities = response.json()
    assert all(c["country_code"] == "GB" for c in cities)
    names = [c["name"] for c in cities]
    assert "London" in names


def test_cities_geojson():
    response = client.get("/api/v1/cities/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0
    feature = data["features"][0]
    assert feature["type"] == "Feature"
    # Urban areas are polygon approximations
    assert feature["geometry"]["type"] == "Polygon"


def test_cities_geojson_filtered():
    response = client.get("/api/v1/cities/geojson?country_code=JP")
    assert response.status_code == 200
    data = response.json()
    codes = [f["properties"]["country_code"] for f in data["features"]]
    assert all(c == "JP" for c in codes)


def test_get_city_by_id():
    response = client.get("/api/v1/cities/london")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "Feature"
    assert data["properties"]["name"] == "London"
    assert data["properties"]["country_code"] == "GB"


def test_get_city_not_found():
    response = client.get("/api/v1/cities/nonexistent_city_xyz")
    assert response.status_code == 404


def test_city_geometry_is_polygon():
    response = client.get("/api/v1/cities/tokyo")
    assert response.status_code == 200
    geometry = response.json()["geometry"]
    assert geometry["type"] == "Polygon"
    # Polygon ring should have >3 points
    ring = geometry["coordinates"][0]
    assert len(ring) > 3
