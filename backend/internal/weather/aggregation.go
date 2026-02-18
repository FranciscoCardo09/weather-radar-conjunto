package weather

import "sort"

// ComputeSummary calcula estadísticas agregadas de los datos meteorológicos.
// Incluye promedios, extremos, ranking por temperatura y agrupación por condición.
func ComputeSummary(data []CityWeather) WeatherSummary {
	var summary WeatherSummary
	summary.ByCondition = make(map[string][]string)

	if len(data) == 0 {
		return summary
	}

	var totalTemp, totalHumidity, totalWind float64
	for _, d := range data {
		totalTemp += d.Temperature
		totalHumidity += d.Humidity
		totalWind += d.WindSpeed
		summary.ByCondition[d.Condition] = append(summary.ByCondition[d.Condition], d.CityName)
	}

	n := float64(len(data))
	summary.AverageTemperature = totalTemp / n
	summary.AverageHumidity = totalHumidity / n
	summary.AverageWindSpeed = totalWind / n

	maxTemp := data[0].Temperature
	minTemp := data[0].Temperature
	maxWind := data[0].WindSpeed
	hottestCity := data[0].CityName
	coldestCity := data[0].CityName
	windiestCity := data[0].CityName

	for _, d := range data {
		if d.Temperature > maxTemp {
			maxTemp = d.Temperature
			hottestCity = d.CityName
		}
		if d.Temperature < minTemp {
			minTemp = d.Temperature
			coldestCity = d.CityName
		}
		if d.WindSpeed > maxWind {
			maxWind = d.WindSpeed
			windiestCity = d.CityName
		}
	}

	summary.HottestCity = hottestCity
	summary.ColdestCity = coldestCity
	summary.WindiestCity = windiestCity

	sorted := make([]CityWeather, len(data))
	copy(sorted, data)

	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Temperature > sorted[j].Temperature
	})

	ranking := make([]string, len(sorted))
	for i, d := range sorted {
		ranking[i] = d.CityName
	}
	summary.Ranking = ranking

	return summary
}
