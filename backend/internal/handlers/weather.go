package handlers

import (
	"log"
	"net/http"

	"weather-radar/backend/internal/cities"
	"weather-radar/backend/internal/weather"

	"github.com/gin-gonic/gin"
)

// GetWeatherByCity devuelve el clima actual de una ciudad.
func GetWeatherByCity(c *gin.Context) {
	cityID := c.Param("city_id")

	city, found := cities.GetByID(cityID)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ciudad no encontrada"})
		return
	}

	data, err := weather.FetchForCity(c.Request.Context(), city)
	if err != nil {
		log.Printf("[ERROR] Error fetching weather for city %s: %v", cityID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener el clima"})
		return
	}

	c.JSON(http.StatusOK, data)
}
