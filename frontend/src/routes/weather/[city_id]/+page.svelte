<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import NavHeader from '$lib/components/NavHeader.svelte'
  import BackLink from '$lib/components/BackLink.svelte'
  import { obtenerClima } from '$lib/api'
  import type { CityWeather } from '$lib/types'
  import { Thermometer, Droplets, Wind, Cloud } from 'lucide-svelte'

  let clima = $state<CityWeather | null>(null)
  let cargando = $state(true)
  let error = $state<string | null>(null)

  async function cargarClima(idCiudad: string): Promise<void> {
    cargando = true
    error = null
    clima = null
    
    try {
      clima = await obtenerClima(idCiudad)
    } catch (e) {
      error = e instanceof Error ? e.message : 'No se pudo conectar con el servidor'
    } finally {
      cargando = false
    }
  }

  onMount(() => {
    const idCiudad = $page.params.city_id
    if (idCiudad) cargarClima(idCiudad)
  })

  // Reaccionar cuando cambia el parámetro de la ruta
  $effect(() => {
    const idCiudad = $page.params.city_id
    if (idCiudad) cargarClima(idCiudad)
  })
</script>

<svelte:head>
  <title>{clima ? `${clima.city_name} – Weather Radar` : 'Clima – Weather Radar'}</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--bg-page)]">
  <NavHeader variant="standard" />

  <main class="flex flex-col gap-8 px-12 py-10">
    <BackLink href="/" />

    {#if cargando}
      <div class="flex items-center justify-center py-24">
        <div
          class="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"
        ></div>
      </div>
    {:else if error}
      <div class="rounded-[16px] p-6" style="background-color: var(--color-error-soft);">
        <p class="font-body text-sm text-[var(--color-error)]">{error}</p>
        <button
          onclick={() => { const id = $page.params.city_id; if (id) cargarClima(id) }}
          class="mt-3 font-body text-sm font-semibold text-[var(--color-error)] underline"
          type="button"
        >
          Reintentar
        </button>
      </div>
    {:else if clima}
      <!-- Sección principal -->
      <div class="flex items-center justify-between gap-10 w-full">
        <!-- Izquierda: info ciudad -->
        <div class="flex flex-col gap-3">
          <h1 class="font-display font-bold text-[40px] text-[var(--text-primary)] leading-tight">
            {clima.city_name}
          </h1>
          <div
            class="flex items-center gap-2 rounded-full px-3 py-1 w-fit"
            style="background-color: var(--bg-card);"
          >
            <Cloud size={14} class="text-[var(--text-secondary)]" />
            <span class="font-body text-sm text-[var(--text-secondary)]">{clima.condition}</span>
          </div>
        </div>

        <!-- Derecha: temperatura grande -->
        <div class="flex flex-col items-end gap-1">
          <span class="font-display font-extrabold text-[72px] text-[var(--text-primary)] leading-none">
            {clima.temperature}°C
          </span>
          <span class="font-body text-sm text-[var(--text-tertiary)]">Temperatura actual</span>
        </div>
      </div>

      <!-- Tarjetas de métricas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <!-- Temperatura -->
        <div class="bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-3">
          <div
            class="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style="background-color: var(--icon-bg-yellow);"
          >
            <Thermometer size={20} class="text-[var(--accent-orange)]" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-display font-extrabold text-[28px] text-[var(--text-primary)] leading-none">
              {clima.temperature}°C
            </span>
            <span class="font-body text-sm text-[var(--text-secondary)]">Temperatura</span>
          </div>
        </div>

        <!-- Humedad -->
        <div class="bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-3">
          <div
            class="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style="background-color: var(--icon-bg-blue);"
          >
            <Droplets size={20} class="text-[var(--accent-primary)]" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-display font-extrabold text-[28px] text-[var(--text-primary)] leading-none">
              {clima.humidity}%
            </span>
            <span class="font-body text-sm text-[var(--text-secondary)]">Humedad</span>
          </div>
        </div>

        <!-- Viento -->
        <div class="bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-3">
          <div
            class="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style="background-color: var(--icon-bg-green);"
          >
            <Wind size={20} class="text-[var(--accent-teal)]" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-display font-extrabold text-[28px] text-[var(--text-primary)] leading-none">
              {clima.wind_speed} km/h
            </span>
            <span class="font-body text-sm text-[var(--text-secondary)]">Velocidad del viento</span>
          </div>
        </div>

        <!-- Condición -->
        <div class="bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-3">
          <div
            class="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style="background-color: var(--icon-bg-purple);"
          >
            <Cloud size={20} class="text-[var(--accent-pink)]" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-display font-bold text-lg text-[var(--text-primary)] leading-snug">
              {clima.condition}
            </span>
            <span class="font-body text-sm text-[var(--text-secondary)]">Condición climática</span>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
