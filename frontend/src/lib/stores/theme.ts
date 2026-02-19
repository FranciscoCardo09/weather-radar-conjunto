import { writable } from 'svelte/store'
import { browser } from '$app/environment'

// leer preferencia guardada o default false
function leerPreferencia(): boolean {
  if (browser) {
    return localStorage.getItem('modoOscuro') === 'true'
  }
  return false
}

// estado del tema oscuro
export const modoOscuro = writable(leerPreferencia())

// aplicar clase dark al iniciar si corresponde
if (browser && leerPreferencia()) {
  document.documentElement.classList.add('dark')
}

// cambiar entre tema claro y oscuro
export function cambiarTema(): void {
  modoOscuro.update((oscuro) => {
    const nuevo = !oscuro

    if (browser) {
      document.documentElement.classList.toggle('dark', nuevo)
      localStorage.setItem('modoOscuro', String(nuevo))
    }

    return nuevo
  })
}
