"""Shared GeoJSON data loader – reads static files once at startup."""

from __future__ import annotations

import json
from functools import cache
from pathlib import Path
from typing import Any

_DATA_DIR = Path(__file__).parent / "data"


@cache
def _load(name: str) -> dict[str, Any]:
    path = _DATA_DIR / name
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def get_countries_collection() -> dict[str, Any]:
    return _load("countries.geojson")


def get_cities_collection() -> dict[str, Any]:
    return _load("cities.geojson")
