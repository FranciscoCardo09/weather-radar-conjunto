export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface CityWeather {
  city_id: string
  city_name: string
  temperature: number
  humidity: number
  wind_speed: number
  condition: string
  error?: string
}

export interface WeatherSummary {
  average_temperature: number
  average_humidity: number
  average_wind_speed: number
  hottest_city: string
  coldest_city: string
  windiest_city: string
  ranking: string[]
  by_condition: Record<string, string[]>
}

export interface CompareResult {
  cities: CityWeather[]
  errors?: CityWeather[]
  summary: WeatherSummary
}

export interface CompareRequest {
  city_ids: string[]
}
