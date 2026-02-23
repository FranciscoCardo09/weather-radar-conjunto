package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"weather-radar/backend/internal/handlers"
	"weather-radar/backend/internal/weather"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// getEnv busca una variable de entorno por su nombre (key).
// Si la variable existe y tiene valor, devuelve ese valor.
// Si no existe o está vacía, devuelve el valor por defecto (fallback).
//
// Esto sirve para que el servidor pueda configurarse sin tocar el código:
// por ejemplo, en producción se puede definir PORT=3000 en el entorno,
// y si no se define nada, usa el valor por defecto que le pasemos.
//
// Recibe:
//   - key: el nombre de la variable de entorno (ej: "PORT")
//   - fallback: el valor que se usa si la variable no existe (ej: "8080")
//
// Devuelve: un string con el valor encontrado o el fallback.
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// main es el punto de entrada del programa. Cuando ejecutás el backend, esto
// es lo primero que corre. Se encarga de:
// 1. Leer la configuración (puerto, URL del frontend)
// 2. Preparar el cliente HTTP que se usará para hablar con la API del clima
// 3. Crear el servidor web con todas sus rutas y protecciones
// 4. Arrancar el servidor para que empiece a escuchar peticiones
func main() {
	// Lee el puerto donde va a correr el servidor.
	// Si no hay variable de entorno "PORT", usa 8080 por defecto.
	port := getEnv("PORT", "8080")

	// Lee la URL del frontend (la app de React/Vue/etc que consume esta API).
	// Esto se usa para configurar CORS (ver más abajo).
	// Por defecto apunta a localhost:5173, que es el puerto típico de Vite en desarrollo.
	frontendURL := getEnv("FRONTEND_URL", "http://localhost:5173")

	// Inicializa el cliente HTTP que se usará para llamar a la API de Open-Meteo.
	// Le pone un timeout de 10 segundos: si la API externa tarda más de 10 segundos
	// en responder, la petición se cancela automáticamente para no dejar al usuario
	// esperando indefinidamente.
	weather.InitClient(10 * time.Second)

	// Crea el "router" de Gin. Un router es como una central telefónica:
	// cuando llega una petición HTTP, el router decide qué función la atiende
	// según la URL y el método (GET, POST, etc.).
	// gin.Default() viene con dos cosas ya incluidas:
	//   - Un logger que imprime cada petición en la consola
	//   - Un "recovery" que si algo explota (panic), el servidor no se cae
	router := gin.Default()

	// --- RATE LIMITER (limitador de velocidad) ---
	// Crea un limitador que permite máximo 10 peticiones por segundo,
	// con una "ráfaga" (burst) de hasta 20 peticiones acumuladas.
	//
	// ¿Qué significa esto? Imaginá un balde con agua:
	//   - El balde tiene capacidad para 20 litros (burst = 20)
	//   - Se llena a razón de 10 litros por segundo (rate = 10)
	//   - Cada petición saca 1 litro
	//   - Si el balde se vacía, las peticiones se rechazan hasta que se vuelva a llenar
	//
	// Esto protege al servidor de ser bombardeado con demasiadas peticiones,
	// ya sea por un ataque o por un error en el frontend que mande muchas peticiones seguidas.
	limiter := rate.NewLimiter(10, 20)

	// Este middleware se ejecuta ANTES de cada petición que llegue al servidor.
	// Pregunta al limitador "¿puedo dejar pasar esta petición?".
	// Si el limitador dice que no (se acabó el presupuesto), devuelve un error 429
	// ("Too Many Requests" / demasiadas peticiones) y corta el procesamiento con Abort().
	// Si dice que sí, llama a c.Next() para que la petición siga su camino normal
	// hacia el handler que le corresponde.
	router.Use(func(c *gin.Context) {
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "demasiadas peticiones"})
			c.Abort()
			return
		}
		c.Next()
	})

	// --- CORS (Cross-Origin Resource Sharing) ---
	// CORS es una protección de los navegadores web. Por defecto, un navegador
	// NO permite que una página web (ej: tu frontend en localhost:5173) haga
	// peticiones a un servidor distinto (ej: tu backend en localhost:8080).
	//
	// Esta configuración le dice al navegador:
	//   - AllowOrigins: "solo dejá que el frontend en esta URL haga peticiones"
	//   - AllowMethods: "solo aceptá peticiones GET y POST" (no DELETE, PUT, etc.)
	//   - AllowHeaders: "solo aceptá estos encabezados en las peticiones"
	//   - AllowCredentials: "permitir que el navegador envíe cookies si las hay"
	//
	// Sin esto, el navegador bloquearía todas las peticiones del frontend al backend.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL, "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	// --- RUTA DE PRUEBA (health check) ---
	// Una ruta simple para verificar que el servidor está vivo.
	// Si hacés GET /ping, te devuelve {"message": "pong"} con estado 200 (OK).
	// Útil para monitoreo: si /ping no responde, sabés que el servidor se cayó.
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// --- GRUPO DE RUTAS DE LA API ---
	// Agrupa todas las rutas bajo /api. Esto es solo organización:
	// en vez de escribir "/api/cities", "/api/weather/...", etc. en cada una,
	// se define el prefijo una vez y las rutas dentro ya lo heredan.
	api := router.Group("/api")
	{
		// GET /api/cities → devuelve la lista de todas las ciudades disponibles.
		// Lo maneja la función handlers.GetCities.
		api.GET("/cities", handlers.GetCities)

		// GET /api/weather/:city_id → devuelve el clima actual de UNA ciudad.
		// El :city_id es un parámetro dinámico en la URL. Por ejemplo:
		// GET /api/weather/cordoba → city_id vale "cordoba"
		// GET /api/weather/mendoza → city_id vale "mendoza"
		// Lo maneja la función handlers.GetWeatherByCity.
		api.GET("/weather/:city_id", handlers.GetWeatherByCity)

		// POST /api/compare → compara el clima de VARIAS ciudades a la vez.
		// Es POST (no GET) porque el frontend le envía datos en el cuerpo de la
		// petición (un JSON con la lista de IDs de ciudades a comparar).
		// Lo maneja la función handlers.CompareWeather.
		api.POST("/compare", handlers.CompareWeather)
	}

	// Imprime en la consola un mensaje diciendo en qué puerto está corriendo.
	log.Printf("servidor corriendo en :%s", port)

	// Arranca el servidor. A partir de acá, el programa se queda "escuchando"
	// peticiones en el puerto indicado. No avanza más allá de esta línea
	// (se queda bloqueado acá hasta que el servidor se detenga o se cierre).
	router.Run(":" + port)
}
