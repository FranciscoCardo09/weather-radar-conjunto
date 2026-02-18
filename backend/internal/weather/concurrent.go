package weather

import (
	"context"
	"log"
	"time"

	"weather-radar/backend/internal/cities"
)

type fetchResult struct {
	index int
	data  *CityWeather
	err   error
}

// FetchForCities obtiene el clima de múltiples ciudades en paralelo.
// Retorna los resultados exitosos y los fallidos por separado,
// manteniendo el orden original de las ciudades exitosas.
func FetchForCities(ctx context.Context, validCities []cities.City) (successful []CityWeather, failed []CityWeather) {
	resultsChan := make(chan fetchResult, len(validCities))

	for i, city := range validCities {
		go func(i int, city cities.City) {
			cityCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()

			data, err := FetchForCity(cityCtx, city)
			resultsChan <- fetchResult{i, data, err}
		}(i, city)
	}

	successMap := make(map[int]CityWeather)
	for range validCities {
		select {
		case res := <-resultsChan:
			if res.err != nil {
				log.Printf("[ERROR] Error fetching weather for city at index %d: %v", res.index, res.err)
				failed = append(failed, CityWeather{
					CityID:   validCities[res.index].ID,
					CityName: validCities[res.index].Name,
					Error:    res.err.Error(),
				})
			} else if res.data != nil {
				successMap[res.index] = *res.data
			}
		case <-ctx.Done():
			log.Printf("[WARN] Request cancelled by context")
			return
		}
	}

	// Mantener orden original
	for i := 0; i < len(validCities); i++ {
		if data, ok := successMap[i]; ok {
			successful = append(successful, data)
		}
	}

	return
}
