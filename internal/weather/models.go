package weather

// OpenMeteoResponse representa los campos relevantes de la respuesta de Open-Meteo.
type OpenMeteoResponse struct {
	Current struct {
		Temperature      float64 `json:"temperature_2m"`
		RelativeHumidity float64 `json:"relative_humidity_2m"`
		WindSpeed        float64 `json:"wind_speed_10m"`
		WeatherCode      int     `json:"weather_code"`
	} `json:"current"`
}

// CityWeather contiene el clima procesado de una ciudad.
type CityWeather struct {
	CityID      string  `json:"city_id"`
	CityName    string  `json:"city_name"`
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	Condition   string  `json:"condition"`
	Error       string  `json:"error,omitempty"`
}

// WeatherSummary contiene las estadísticas agregadas.
type WeatherSummary struct {
	AverageTemperature float64             `json:"average_temperature"`
	AverageHumidity    float64             `json:"average_humidity"`
	AverageWindSpeed   float64             `json:"average_wind_speed"`
	HottestCity        string              `json:"hottest_city"`
	ColdestCity        string              `json:"coldest_city"`
	WindiestCity       string              `json:"windiest_city"`
	Ranking            []string            `json:"ranking"`
	ByCondition        map[string][]string `json:"by_condition"`
}

// CompareResult es la respuesta del endpoint de comparación.
type CompareResult struct {
	Cities  []CityWeather  `json:"cities"`
	Errors  []CityWeather  `json:"errors,omitempty"`
	Summary WeatherSummary `json:"summary"`
}

// CompareRequest es el body esperado en POST /api/compare.
type CompareRequest struct {
	CityIDs []string `json:"city_ids"`
}
