<script lang="ts">
  import { page } from '$app/stores'
  import { Moon, Sun, CloudSun } from 'lucide-svelte'
  import { modoOscuro, cambiarTema } from '$lib/stores/theme'
  import { slide } from 'svelte/transition'
  import { cubicInOut } from 'svelte/easing'
  import { onMount } from 'svelte'

  interface Props {
    variant?: 'home' | 'standard'
  }

  let { variant = 'standard' }: Props = $props()

  // ver en qué página estamos
  const estaEnHome = $derived($page.url.pathname === '/')
  const estaEnComparar = $derived($page.url.pathname === '/compare')

  // Estado para la posición del indicador (animación inmediata al clic)
  let indicadorPosicion = $state(estaEnHome ? 0 : 1)

  // Actualizar posición basado en la ruta actual
  $effect(() => {
    indicadorPosicion = estaEnHome ? 0 : estaEnComparar ? 1 : 0
  })

  // mostrar header con video de fondo en home
  const mostrarHeaderOscuro = $derived(variant === 'home')

  // Funciones para manejar el clic inmediato
  function handleClickCiudades() {
    indicadorPosicion = 0
  }

  function handleClickComparar() {
    indicadorPosicion = 1
  }
</script>

{#if mostrarHeaderOscuro}
  <!-- Header azul oscuro para home -->
  <header
    class="flex items-center justify-between h-16 px-12 py-3 w-full relative z-10"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 relative z-10">
      <div
        class="w-9 h-9 rounded-lg flex items-center justify-center"
        style="background-color: rgba(255,255,255,0.12);"
      >
        <CloudSun size={18} color="white" />
      </div>
      <span class="font-display font-bold text-lg text-white">Weather Radar</span>
    </div>

    <!-- Nav -->
    <div class="flex items-center gap-2 relative z-10">
      <!-- Indicador animado de pestaña activa -->
      <div
        class="absolute h-[38px] bg-white/[0.12] rounded-lg transition-transform duration-500 ease-out"
        style="
          width: 84px;
          transform: translateX({indicadorPosicion * 92}px);
          will-change: transform;
        "
      ></div>
      <a
        href="/"
        onclick={handleClickCiudades}
        class="font-body text-sm font-medium text-white px-4 py-2 rounded-lg relative z-10 w-[84px] text-center flex items-center justify-center h-[38px]"
      >
        Ciudades
      </a>
      <a
        href="/compare"
        onclick={handleClickComparar}
        class="font-body text-sm font-medium text-white px-4 py-2 rounded-lg relative z-10 w-[84px] text-center flex items-center justify-center h-[38px]"
      >
        Comparar
      </a>
      <button
        onclick={cambiarTema}
        class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
        style="background-color: rgba(255,255,255,0.08);"
        aria-label="Cambiar tema"
        type="button"
      >
        {#if $modoOscuro}
          <Sun size={16} color="white" />
        {:else}
          <Moon size={16} color="white" />
        {/if}
      </button>
    </div>
  </header>
{:else}
  <!-- Header estándar claro/oscuro -->
  <header
    class="flex items-center justify-between h-[72px] px-12 w-full border-b border-[var(--border-standard)] bg-[var(--bg-page)] relative"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-[10px] bg-[var(--accent-primary)] flex items-center justify-center">
        <CloudSun size={18} color="white" />
      </div>
      <span class="font-display font-bold text-[20px] text-[var(--text-primary)]">Weather Radar</span>
    </div>

    <!-- Navegación -->
    <div class="flex items-center gap-2 relative">
      <!-- Indicador animado de pestaña activa -->
      <div
        class="absolute h-[38px] rounded-[10px] transition-transform duration-500 ease-out"
        style="
          background-color: {estaEnComparar ? 'var(--accent-primary-soft)' : 'var(--bg-card)'};
          width: 84px;
          transform: translateX({indicadorPosicion * 92}px);
          will-change: transform;
        "
      ></div>
      <a
        href="/"
        onclick={handleClickCiudades}
        class="font-body text-sm font-medium px-4 py-2 rounded-[10px] relative z-10 w-[84px] text-center flex items-center justify-center h-[38px]"
        class:text-[var(--text-primary)]={estaEnHome}
        class:text-[var(--text-secondary)]={!estaEnHome}
      >
        Ciudades
      </a>
      <a
        href="/compare"
        onclick={handleClickComparar}
        class="font-body text-sm font-medium px-4 py-2 rounded-[10px] relative z-10 w-[84px] text-center flex items-center justify-center h-[38px]"
        class:text-[var(--accent-primary)]={estaEnComparar}
        class:text-[var(--text-secondary)]={!estaEnComparar}
      >
        Comparar
      </a>
      <button
        onclick={cambiarTema}
        class="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors"
        aria-label="Cambiar tema"
        type="button"
      >
        {#if $modoOscuro}
          <Sun size={16} class="text-[var(--text-secondary)]" />
        {:else}
          <Moon size={16} class="text-[var(--text-secondary)]" />
        {/if}
      </button>
    </div>
  </header>
{/if}
