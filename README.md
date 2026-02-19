# Weather Radar - Backend

Backend unificado para consulta y comparación de datos meteorológicos en tiempo real, construido a partir de la consolidación de dos implementaciones previas del mismo sistema.

## Origen del código

Juntamos dos proyectos que hicimos por separado para la misma consigna. Agarramos lo mejor de cada uno.

### De proyecto-fran

La mayoría de la lógica del backend: configuración por env vars, cliente HTTP con connection pooling, rate limiting, graceful shutdown, validaciones completas en el compare (duplicados, máximo 50, existencia, etc.), concurrencia con canales buffered y timeout por ciudad, las 15 ciudades argentinas, búsqueda por mapa, mapeo de códigos WMO, ranking por temperatura y logging.

### De proyecto-nico

La estructura de carpetas (`cmd/` + `internal/`), la separación en paquetes por dominio, el manejo de errores parciales en la comparación (si una ciudad falla no se cae todo), el endpoint `/ping` y el campo `Error` en `CityWeather` para reportar fallos individuales.

### Qué descartamos

CORS manual de Nico (reemplazado por librería), `GetAll()` que recreaba la lista en cada llamada, búsqueda lineal de ciudades, un tipo `RankingEntry` que nunca se usaba, comentarios de debug que habían quedado, y nombres de campos mal escritos que corregimos.

## Estructura del proyecto

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Bootstrap, config, middleware, routes, shutdown
├── internal/
│   ├── handlers/
│   │   ├── cities.go               # GET /api/cities
│   │   ├── weather.go              # GET /api/weather/:city_id
│   │   └── compare.go              # POST /api/compare
│   ├── cities/
│   │   ├── city.go                 # Struct City
│   │   └── repository.go           # GetAll(), GetByID()
│   └── weather/
│       ├── models.go               # DTOs y structs de respuesta
│       ├── conditions.go           # Traducción de weather codes WMO
│       ├── client.go               # HTTP client + FetchForCity
│       ├── concurrent.go           # FetchForCities (fan-out/fan-in)
│       └── aggregation.go          # ComputeSummary (promedios, extremos, ranking)
├── go.mod
└── go.sum
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ping` | Health check |
| GET | `/api/cities` | Lista de ciudades disponibles |
| GET | `/api/weather/:city_id` | Clima actual de una ciudad |
| POST | `/api/compare` | Comparación de múltiples ciudades |

### POST /api/compare

**Request:**
```json
{
  "city_ids": ["cordoba", "buenosaires", "mendoza"]
}
```

**Response:**
```json
{
  "cities": [...],
  "errors": [...],
  "summary": {
    "average_temperature": 22.5,
    "average_humidity": 45.0,
    "average_wind_speed": 12.3,
    "hottest_city": "Córdoba",
    "coldest_city": "Mendoza",
    "windiest_city": "Buenos Aires",
    "ranking": ["Córdoba", "Buenos Aires", "Mendoza"],
    "by_condition": {
      "Despejado": ["Córdoba"],
      "Parcialmente nublado": ["Buenos Aires", "Mendoza"]
    }
  }
}
```

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8080` | Puerto del servidor (1-65535) |
| `FRONTEND_URL` | `http://localhost:5173` | Origen permitido para CORS |
| `API_TIMEOUT` | `10` | Timeout en segundos para requests a Open-Meteo (1-60) |
| `RATE_LIMIT` | `10` | Requests por segundo permitidos |
| `RATE_LIMIT_BURST` | `20` | Burst máximo del rate limiter |

## Ejecución

```bash
cd backend
go run ./cmd/server/
```

Con configuración personalizada:

```bash
PORT=3000 FRONTEND_URL=http://localhost:3001 API_TIMEOUT=5 go run ./cmd/server/
```

## Stack

- Go 1.25.7
- Gin v1.11.0
- gin-contrib/cors v1.7.6
- golang.org/x/time (rate limiting)
- Open-Meteo API (datos meteorológicos)
