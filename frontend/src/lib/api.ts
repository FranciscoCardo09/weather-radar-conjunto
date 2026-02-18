import type { City, CityWeather, CompareResult } from './types'

// URL base de la API
const URL_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080/api'

// funciones auxiliares para hacer peticiones
async function hacerGet<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}${ruta}`)
  
  if (!respuesta.ok) {
    // si hay demasiadas peticiones
    if (respuesta.status === 429) {
      throw new Error('Demasiadas consultas, esperá unos segundos')
    }
    throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
  }
  
  return respuesta.json() as Promise<T>
}

async function hacerPost<T>(ruta: string, datos: unknown): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  
  if (!respuesta.ok) {
    if (respuesta.status === 429) {
      throw new Error('Demasiadas consultas, esperá unos segundos')
    }
    throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
  }
  
  return respuesta.json() as Promise<T>
}

// obtener todas las ciudades
export const obtenerCiudades = (): Promise<City[]> => {
  return hacerGet<City[]>('/cities')
}

// obtener clima de una ciudad específica
export const obtenerClima = (idCiudad: string): Promise<CityWeather> => {
  return hacerGet<CityWeather>(`/weather/${idCiudad}`)
}

// comparar clima de varias ciudades
export const compararClimas = (idsCiudades: string[]): Promise<CompareResult> => {
  return hacerPost<CompareResult>('/compare', { city_ids: idsCiudades })
}
