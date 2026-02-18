package weather

// WeatherCodeToCondition traduce el weather_code de Open-Meteo (WMO)
// a una condición climática legible.
func WeatherCodeToCondition(code int) string {
	switch {
	case code == 0:
		return "Despejado"
	case code > 0 && code <= 3:
		return "Parcialmente nublado"
	case code > 3 && code <= 48:
		return "Nublado"
	case code > 48 && code <= 57:
		return "Lluvia ligera"
	case code > 57 && code <= 67:
		return "Lluvia moderada"
	case code > 67 && code <= 77:
		return "Lluvia intensa"
	case code > 77 && code <= 86:
		return "Nieve ligera"
	case code > 86 && code <= 95:
		return "Nieve moderada"
	case code > 95 && code <= 99:
		return "Nieve intensa"
	default:
		return "Desconocido"
	}
}
