# Weather Radar - Backend

Backend unificado para consulta y comparación de datos meteorológicos en tiempo real, construido a partir de la consolidación de dos implementaciones previas del mismo sistema.

## Origen del código

Este backend es el resultado de juntar dos proyectos que hicimos por separado para la misma consigna. Cada uno lo resolvió a su manera, así que agarramos lo mejor de cada uno y armamos esta versión final.

- **proyecto-fran**: Tenía todo en un solo paquete pero estaba bastante completo en cuanto a configuración, rate limiting, manejo de conexiones y validaciones.
- **proyecto-nico**: Estaba mejor organizado en carpetas y paquetes, y tenía un buen manejo de errores parciales (si una ciudad fallaba, las demás seguían funcionando).

### Qué usamos de cada proyecto

#### De proyecto-fran

- **Configuración con variables de entorno**: El proyecto de Nico tenía todo hardcodeado, así que usamos el sistema de config de Fran que lee de env vars con valores por defecto.
- **Cliente HTTP con connection pooling**: Nico creaba un cliente nuevo en cada request, lo que no reutiliza conexiones. Fran ya tenía uno compartido con pooling configurado.
- **Rate limiting**: Nico no tenía ningún tipo de límite de requests. Usamos el rate limiter de Fran con `golang.org/x/time/rate`.
- **CORS con gin-contrib/cors**: Nico seteaba los headers de CORS a mano. Usamos la librería que ya tenía Fran.
- **Graceful shutdown**: Nico usaba `router.Run()` directo. Fran tenía manejo de señales para apagar el servidor limpiamente.
- **Validaciones en el endpoint de comparación**: Fran validaba JSON, lista vacía, máximo 50 ciudades, duplicados, que las ciudades existan, y mínimo 2 distintas. Nico solo validaba el JSON.
- **Concurrencia con canales buffered**: Para traer el clima de varias ciudades a la vez. Fran usaba canales buffered con timeout por ciudad. Nico usaba canal sin buffer y sin timeout individual.
- **15 ciudades argentinas**: Nico tenía 6 ciudades de distintos países. Fran tenía las 15 ciudades argentinas que pedía la consigna.
- **Búsqueda de ciudades por mapa**: Nico buscaba recorriendo toda la lista cada vez. Fran usaba un mapa para buscar directo por ID.
- **Mapeo de códigos del clima (WMO)**: Fran tenía más categorías que Nico para los códigos de condición climática.
- **Ranking de ciudades por temperatura**: El resumen de Fran incluye un ranking ordenado que Nico no tenía.
- **Logging**: Nico no logueaba nada. Fran tenía logs con niveles de severidad.

#### De proyecto-nico

- **Estructura de carpetas (`cmd/` + `internal/`)**: Es la forma estándar de organizar un proyecto en Go. Fran tenía todo en un solo paquete, lo cual funciona pero no escala bien.
- **Separación en paquetes (`handlers`, `cities`, `weather`)**: Cada parte del código tiene su lugar. Es más fácil de leer y mantener.
- **Manejo de errores parciales en comparación**: Si pedís 5 ciudades y una falla, te devuelve las 4 que funcionaron y te avisa cuál falló. En el proyecto de Fran si una fallaba, fallaba toda la request.
- **Endpoint `/ping`**: Un health check simple que Fran no tenía.
- **Campo `Error` en `CityWeather`**: Para poder decirte qué pasó con cada ciudad que falló individualmente.

### Qué descartamos

- **CORS manual de Nico**: Era frágil y propenso a errores, lo reemplazamos por la librería.
- **`GetAll()` de Nico**: Creaba una lista nueva cada vez que la llamabas. Usamos una lista pre-calculada que se arma una sola vez.
- **Búsqueda lineal de Nico**: Muy lenta si crecía la lista de ciudades. Usamos el mapa.
- **`RankingEntry` de Fran**: Un tipo que estaba definido pero nunca se usaba. Lo sacamos.
- **Comentarios de debug de Nico**: Había notas tipo "Tuve un error de failed to fech..." que eran de cuando estaba desarrollando. Los limpiamos.
- **Comentario largo al final de `compare.go` de Nico**: 7 líneas explicando algo que ya se entendía leyendo el código. Lo sacamos.
- **Nombres de campos mal escritos de Fran**: `Relativehumidity` y `Windspeed10` los corregimos a `RelativeHumidity` y `WindSpeed` que es como se nombra en Go.

### Decisiones que tomamos

1. **Estructura estándar de Go**: Aunque el paquete plano de Fran funcionaba, elegimos la estructura de Nico porque es lo que se recomienda y facilita que el proyecto crezca.

2. **No sacrificar cosas que ya funcionaban bien**: Rate limiting, connection pooling y graceful shutdown ya estaban hechos en el proyecto de Fran y no tenía sentido sacarlos.

3. **Que no se caiga todo si falla una ciudad**: Si pedís comparar 5 ciudades y la API no responde para una, te mostramos las otras 4 y te avisamos cuál falló.

4. **Validar todo en los handlers**: Antes de hacer cualquier cosa, chequeamos que los datos que mandó el usuario estén bien. Si algo está mal, respondemos con un error claro.

5. **Nombres consistentes**: Unificamos cómo se nombran las cosas en todo el proyecto para que sea más fácil de leer.

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
