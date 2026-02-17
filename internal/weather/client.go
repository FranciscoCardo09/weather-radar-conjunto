package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"weather-radar/backend/internal/cities"
)

// Cliente HTTP global con connection pooling
var httpClient *http.Client

// InitClient inicializa el cliente HTTP con el timeout configurado.
func InitClient(timeout time.Duration) {
	httpClient = &http.Client{
		Timeout: timeout,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 10,
			IdleConnTimeout:     90 * time.Second,
		},
	}
}

// FetchForCity obtiene los datos meteorológicos actuales para una ciudad.
// Respeta el contexto para cancelación y timeout.
func FetchForCity(ctx context.Context, city cities.City) (*CityWeather, error) {
	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
		city.Latitude, city.Longitude,
	)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API error: %s", resp.Status)
	}

	var apiResp OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}

	return &CityWeather{
		CityID:      city.ID,
		CityName:    city.Name,
		Temperature: apiResp.Current.Temperature,
		Humidity:    apiResp.Current.RelativeHumidity,
		WindSpeed:   apiResp.Current.WindSpeed,
		Condition:   WeatherCodeToCondition(apiResp.Current.WeatherCode),
	}, nil
}
