package handlers

import (
	"net/http"

	"weather-radar/backend/internal/cities"

	"github.com/gin-gonic/gin"
)

// GetCities devuelve todas las ciudades disponibles.
func GetCities(c *gin.Context) {
	c.JSON(http.StatusOK, cities.GetAll())
}
