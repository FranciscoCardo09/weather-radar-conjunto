import { writable } from 'svelte/store'
import { browser } from '$app/environment'

// estado del tema oscuro
export const modoOscuro = writable(false)

// cambiar entre tema claro y oscuro
export function cambiarTema(): void {
  modoOscuro.update((oscuro) => {
    const nuevo = !oscuro
    
    // solo en el navegador
    if (browser) {
      document.documentElement.classList.toggle('dark', nuevo)
    }
    
    return nuevo
  })
}
