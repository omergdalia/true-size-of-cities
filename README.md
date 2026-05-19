# True Size of Cities

> Like [The True Size of Countries](https://thetruesize.com/) – but for **cities**.

Compare the actual geographic footprint of capital cities against any country on the globe. Select a base country to highlight, then add one or more capital cities as coloured overlay polygons to appreciate their true scale.

---

## Architecture

```
true-size-of-cities/
├── backend/          # Python 3.12 · FastAPI · GeoJSON data
│   ├── app/
│   │   ├── main.py           # FastAPI app + CORS
│   │   ├── config.py         # Pydantic-settings config
│   │   ├── data_loader.py    # Cached GeoJSON loader
│   │   ├── schemas.py        # Pydantic response models
│   │   ├── routers/
│   │   │   ├── countries.py  # /api/v1/countries endpoints
│   │   │   └── cities.py     # /api/v1/cities endpoints
│   │   └── data/
│   │       ├── countries.geojson   # 20 countries (bbox polygons)
│   │       └── cities.geojson      # 30 capital cities (urban-area circles)
│   └── tests/
│       └── test_api.py       # 14 pytest tests
└── frontend/         # React 19 · Vite · TypeScript · Mapbox GL JS
    └── src/
        ├── api/          # fetch wrappers for the FastAPI backend
        ├── components/
        │   ├── Map/      # Mapbox GL JS map container + layer management
        │   └── Sidebar/  # Country selector + city search + active overlays
        ├── hooks/        # React Query data hooks
        ├── store/        # Zustand global state
        └── types/        # Shared TypeScript types
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Python | ≥ 3.12 |
| Node.js | ≥ 20 |
| Mapbox token | [Get one free](https://account.mapbox.com/access-tokens/) |

---

### 1 · Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

**Key endpoints**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/countries` | List all countries |
| GET | `/api/v1/countries/geojson` | Full GeoJSON FeatureCollection |
| GET | `/api/v1/countries/{code}` | Single country by ISO-3166 code |
| GET | `/api/v1/cities` | List all cities (`?country_code=GB` to filter) |
| GET | `/api/v1/cities/geojson` | Full GeoJSON FeatureCollection |
| GET | `/api/v1/cities/{id}` | Single city by slug (`london`, `tokyo`, …) |

**Run tests**

```bash
cd backend
pytest tests/ -v
```

---

### 2 · Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env – fill in VITE_MAPBOX_TOKEN
npm install
npm run dev
# → http://localhost:5173
```

> The Vite dev-server proxies `/api` requests to `http://localhost:8000`.

---

### 3 · Docker Compose (both services)

```bash
# Copy and populate the root .env
echo "VITE_MAPBOX_TOKEN=pk.your_token_here" > .env

docker compose up --build
# Backend  → http://localhost:8000
# Frontend → http://localhost:5173
```

---

## GeoJSON Data

The bundled data in `backend/app/data/` is intentionally simplified:

* **countries.geojson** – bounding-box polygons for 20 major countries. For production, replace with [Natural Earth 1:10m Admin 0 Countries](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) data.
* **cities.geojson** – circular approximations of 30 capital-city urban areas (radius in km). For production, replace with [Global Human Settlement Layer (GHSL)](https://ghsl.jrc.ec.europa.eu/) or OpenStreetMap administrative boundary data.

---

## Extending the App

| Goal | How |
|------|-----|
| Add a new country | Append a Feature to `backend/app/data/countries.geojson` |
| Add a real city polygon | Replace the circular approximation in `cities.geojson` with a true multipolygon boundary from OSM/GHSL |
| Deploy to production | Set `CORS_ORIGINS` in the backend env to your domain; build the frontend with `npm run build` and serve `dist/` via any static host (Vercel, Netlify, S3…) |
| True-size Mercator shift | Implement a coordinate-transform utility that moves a city polygon's centroid to a target latitude while preserving its Mercator-correct size |

---

## Licence

MIT
