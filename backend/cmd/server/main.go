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

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	port := getEnv("PORT", "8080")
	frontendURL := getEnv("FRONTEND_URL", "http://localhost:5173")

	weather.InitClient(10 * time.Second)

	router := gin.Default()

	// rate limiter
	limiter := rate.NewLimiter(10, 20)
	router.Use(func(c *gin.Context) {
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "demasiadas peticiones"})
			c.Abort()
			return
		}
		c.Next()
	})

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	api := router.Group("/api")
	{
		api.GET("/cities", handlers.GetCities)
		api.GET("/weather/:city_id", handlers.GetWeatherByCity)
		api.POST("/compare", handlers.CompareWeather)
	}

	log.Printf("servidor corriendo en :%s", port)
	router.Run(":" + port)
}
