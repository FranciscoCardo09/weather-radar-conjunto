package handlers

import (
	"log"
	"net/http"

	"weather-radar/backend/internal/cities"
	"weather-radar/backend/internal/weather"

	"github.com/gin-gonic/gin"
)

// CompareWeather compara el clima de múltiples ciudades y retorna estadísticas agregadas.
func CompareWeather(c *gin.Context) {
	var req weather.CompareRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	if len(req.CityIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Debes proporcionar al menos una ciudad"})
		return
	}

	if len(req.CityIDs) > 50 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Máximo 50 ciudades por comparación"})
		return
	}

	// Eliminar duplicados y validar existencia
	seen := make(map[string]bool)
	var validCities []cities.City
	for _, id := range req.CityIDs {
		if seen[id] {
			continue
		}
		seen[id] = true

		city, found := cities.GetByID(id)
		if !found {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ciudad con ID " + id + " no encontrada"})
			return
		}
		validCities = append(validCities, city)
	}

	if len(validCities) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Debes proporcionar al menos dos ciudades distintas"})
		return
	}

	successful, failed := weather.FetchForCities(c.Request.Context(), validCities)

	if len(failed) > 0 {
		log.Printf("[WARN] %d ciudades fallaron en la comparación", len(failed))
	}

	if len(successful) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener datos del clima"})
		return
	}

	summary := weather.ComputeSummary(successful)

	c.JSON(http.StatusOK, weather.CompareResult{
		Cities:  successful,
		Errors:  failed,
		Summary: summary,
	})
}
