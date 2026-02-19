package weather

// WeatherCodeToCondition traduce el weather_code de Open-Meteo (WMO)
// a una condición climática legible.
func WeatherCodeToCondition(code int) string {
	switch {
	case code == 0:
		return "Despejado"
	case code >= 1 && code <= 3:
		return "Parcialmente nublado"
	case code >= 4 && code <= 9:
		return "Nublado"
	case code >= 10 && code <= 12:
		return "Bruma"
	case code >= 13 && code <= 19:
		return "Relámpagos"
	case code >= 20 && code <= 29:
		return "Precipitación reciente"
	case code >= 30 && code <= 39:
		return "Tormenta de polvo"
	case code >= 40 && code <= 49:
		return "Niebla"
	case code >= 50 && code <= 55:
		return "Llovizna"
	case code >= 56 && code <= 57:
		return "Llovizna helada"
	case code >= 60 && code <= 63:
		return "Lluvia ligera"
	case code >= 64 && code <= 65:
		return "Lluvia intensa"
	case code >= 66 && code <= 67:
		return "Lluvia helada"
	case code >= 68 && code <= 69:
		return "Aguanieve"
	case code >= 70 && code <= 75:
		return "Nieve"
	case code >= 76 && code <= 77:
		return "Granizo fino"
	case code >= 80 && code <= 82:
		return "Chaparrón"
	case code >= 83 && code <= 84:
		return "Chaparrón de aguanieve"
	case code >= 85 && code <= 86:
		return "Chaparrón de nieve"
	case code >= 87 && code <= 90:
		return "Granizo"
	case code >= 91 && code <= 94:
		return "Tormenta leve"
	case code >= 95 && code <= 97:
		return "Tormenta eléctrica"
	case code >= 98 && code <= 99:
		return "Tormenta con granizo"
	default:
		return "Desconocido"
	}
}
