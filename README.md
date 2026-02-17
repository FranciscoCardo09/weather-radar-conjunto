# Weather Radar - Backend

Backend unificado para consulta y comparación de datos meteorológicos en tiempo real, construido a partir de la consolidación de dos implementaciones previas del mismo sistema.

## Origen del código

Este backend resulta de la fusión técnica de dos proyectos independientes que resolvían el mismo problema con enfoques distintos:

- **proyecto-fran**: Backend en Go con estructura plana (`package main`), enfocado en robustez operacional (config validada, rate limiting, graceful shutdown, connection pooling).
- **proyecto-nico**: Backend en Go con estructura estándar (`cmd/` + `internal/`), enfocado en separación de responsabilidades por paquetes.

### Qué se tomó de cada proyecto

#### De proyecto-fran

| Componente | Justificación |
|---|---|
| Gestión de configuración (`loadConfig`) | Única implementación con validación de env vars, rangos y defaults. proyecto-nico tenía todo hardcoded |
| Cliente HTTP con connection pooling | proyecto-nico creaba un `http.Client{}` nuevo por cada request, lo que impide reutilización de conexiones TCP |
| Rate limiting (`golang.org/x/time/rate`) | proyecto-nico no tenía protección contra abuso |
| CORS vía `gin-contrib/cors` | proyecto-nico usaba una implementación manual inline con headers seteados a mano |
| Graceful shutdown | proyecto-nico usaba `router.Run()` sin manejo de señales |
| Validación de input en compare | 5 niveles: JSON binding, lista vacía, máximo 50, duplicados, existencia de ciudad, mínimo 2 distintas. proyecto-nico solo validaba JSON binding e ignoraba ciudades inválidas silenciosamente |
| Concurrencia con canales buffered | Canal buffered, timeout de 5s por ciudad, propagación de contexto, preservación de orden. proyecto-nico usaba canal unbuffered sin timeout per-city |
| Catálogo de 15 ciudades argentinas | proyecto-nico tenía 6 ciudades de distintos países |
| Lookup de ciudades por map O(1) | proyecto-nico usaba iteración lineal O(n) y recreaba el slice en cada llamada |
| Mapping de weather codes (9 categorías) | Mayor granularidad que las 6 categorías de proyecto-nico |
| Aggregator con ranking por temperatura | El `ComputeSummary` de proyecto-fran incluye ranking ordenado. proyecto-nico no lo tenía |
| Logging con niveles de severidad | proyecto-nico no tenía logging |

#### De proyecto-nico

| Componente | Justificación |
|---|---|
| Estructura de carpetas (`cmd/server`, `internal/`) | Standard Go project layout. proyecto-fran usaba paquete plano, lo que impide importar código desde otros módulos |
| Separación en paquetes (`handlers`, `cities`, `weather`) | Cada dominio en su propio paquete con responsabilidad acotada. proyecto-fran mezclaba todo en `package main` |
| Separación de exitosos/fallidos en compare | La respuesta incluye `cities` (exitosos) y `errors` (fallidos) por separado, permitiendo degradación parcial. proyecto-fran fallaba la request completa si una ciudad no respondía |
| Endpoint `/ping` | Health check básico ausente en proyecto-fran |
| Campo `Error` en `CityWeather` | Permite comunicar errores parciales por ciudad individual |

### Qué se descartó

- **CORS manual de proyecto-nico**: Implementación frágil con headers seteados inline, reemplazada por `gin-contrib/cors`.
- **`GetAll()` de proyecto-nico**: Recreaba un slice nuevo en cada invocación. Reemplazado por slice pre-calculado en init.
- **Búsqueda lineal de ciudades de proyecto-nico**: O(n) por cada lookup. Reemplazado por map O(1).
- **`RankingEntry` de proyecto-fran**: Tipo definido pero nunca utilizado. Eliminado.
- **Comentarios personales de proyecto-nico**: Notas de debugging en código de producción (`"Tuve un error de failed to fech..."`). Eliminados.
- **Bloque explicativo al final de `compare.go` de proyecto-nico**: Comentario redundante de 7 líneas describiendo el flujo ya evidente en el código.
- **`Relativehumidity` / `Windspeed10` de proyecto-fran**: Nombres de campo corregidos a `RelativeHumidity` / `WindSpeed` para seguir convenciones Go.

### Decisiones arquitectónicas priorizadas

1. **Estructura estándar Go por sobre conveniencia**: La estructura plana de proyecto-fran era funcional pero no escalable. Se adoptó `cmd/` + `internal/` de proyecto-nico como base organizativa.

2. **Robustez operacional por sobre simplicidad**: Configuración validada, rate limiting, graceful shutdown y connection pooling no son opcionales en un servicio que hace requests a APIs externas.

3. **Degradación parcial por sobre fallo total**: Si 4 de 5 ciudades responden, el cliente recibe datos de 4 ciudades más un array de errores. La versión de proyecto-fran fallaba toda la request.

4. **Validación estricta en el borde**: Toda validación de input ocurre en el handler antes de invocar lógica de negocio. Errores detectables se rechazan temprano con status codes apropiados.

5. **Consistencia de naming**: Se unificaron las convenciones de naming (PascalCase para campos exportados, camelCase para variables locales) eliminando inconsistencias presentes en ambos proyectos.

### Mejoras estructurales logradas

- Código organizado en 5 paquetes con responsabilidades claras vs paquete único.
- Eliminación de estado global expuesto (el HTTP client ahora se inicializa vía función exportada del paquete `weather`).
- Repositorio de ciudades con slice pre-calculado en vez de reconstrucción por request.
- Firma de `FetchForCities` retorna `(successful, failed)` en vez de `([]data, error)`, eliminando la ambigüedad entre "no hay datos" y "contexto cancelado".
- Modelos con JSON tags consistentes y campos con nombres Go idiomáticos.

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
