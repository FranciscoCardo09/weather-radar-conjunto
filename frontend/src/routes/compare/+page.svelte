<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import NavHeader from '$lib/components/NavHeader.svelte'
  import BackLink from '$lib/components/BackLink.svelte'
  import WeatherCityCard from '$lib/components/WeatherCityCard.svelte'
  import ErrorCard from '$lib/components/ErrorCard.svelte'
  import SummaryPanel from '$lib/components/SummaryPanel.svelte'
  import { obtenerCiudades, compararClimas } from '$lib/api'
  import type { City, CompareResult } from '$lib/types'

  let ciudades = $state<City[]>([])
  let idsSeleccionados = $state<Set<string>>(new Set())
  let resultado = $state<CompareResult | null>(null)
  let cargando = $state(false)
  let cargandoCiudades = $state(true)
  let error = $state<string | null>(null)

  const cantidadSeleccionados = $derived(idsSeleccionados.size)
  const puedeComparar = $derived(cantidadSeleccionados >= 2 && cantidadSeleccionados <= 50)

  onMount(async () => {
    // cargar lista de ciudades
    try {
      ciudades = await obtenerCiudades()
    } catch (e) {
      error = e instanceof Error ? e.message : 'No se pudo conectar con el servidor'
    } finally {
      cargandoCiudades = false
    }

    // auto ejecutar si viene el parametro ?ids=
    const parametroIds = $page.url.searchParams.get('ids')
    if (parametroIds) {
      const ids = [...new Set(parametroIds.split(',').filter(Boolean))]
      if (ids.length >= 2) {
        idsSeleccionados = new Set(ids)
        await ejecutarComparacion(ids)
      }
    }
  })

  function alternarCiudad(id: string): void {
    const nuevosIds = new Set(idsSeleccionados)
    
    if (nuevosIds.has(id)) {
      nuevosIds.delete(id)
    } else {
      // max 50 ciudades
      if (nuevosIds.size >= 50) return
      nuevosIds.add(id)
    }
    
    idsSeleccionados = nuevosIds
  }

  async function ejecutarComparacion(ids?: string[]): Promise<void> {
    const idsAComparar = ids ?? [...idsSeleccionados]
    if (idsAComparar.length < 2) return

    cargando = true
    error = null
    resultado = null

    try {
      resultado = await compararClimas(idsAComparar)
      
      // actualizar URL con los IDs seleccionados
      const url = new URL(window.location.href)
      url.searchParams.set('ids', idsAComparar.join(','))
      goto(url.pathname + url.search, { replaceState: true, noScroll: true })
    } catch (e) {
      error = e instanceof Error ? e.message : 'No se pudo conectar con el servidor'
    } finally {
      cargando = false
    }
  }
</script>

<svelte:head>
  <title>Comparar ciudades – Weather Radar</title>
</svelte:head>

<div class="min-h-screen flex flex-col" style="background-color: var(--home-bg);">
  <NavHeader variant="home" />

  <main class="flex flex-col gap-8 px-12 py-10">
    <BackLink href="/" />

    <!-- Title -->
    <div class="flex flex-col gap-1">
      <h1 class="font-display font-bold text-[28px] text-[var(--text-primary)]">
        Comparar ciudades
      </h1>
      <p class="font-body text-sm text-[var(--text-secondary)]">
        Seleccioná las ciudades que querés comparar
      </p>
    </div>

    <!-- City selector section -->
    <div
      class="bg-[var(--bg-card)] rounded-[16px] p-6 flex flex-col gap-4 w-full"
    >
      <span class="font-display font-bold text-base text-[var(--text-primary)]">
        Ciudades disponibles
      </span>

      {#if cargandoCiudades}
        <div class="flex items-center gap-2">
          <div
            class="w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"
          ></div>
          <span class="font-body text-sm text-[var(--text-secondary)]">Cargando ciudades…</span>
        </div>
      {:else}
        <!-- City chips -->
        <div class="flex flex-wrap gap-2 w-full">
          {#each ciudades as city (city.id)}
            {@const isSelected = idsSeleccionados.has(city.id)}
            <button
              onclick={() => alternarCiudad(city.id)}
              type="button"
              class="font-body text-sm px-3 py-[6px] rounded-full border transition-colors"
              style={isSelected
                ? 'background-color: var(--yale-blue); color: white; border-color: var(--yale-blue);'
                : 'background-color: transparent; color: var(--chip-unselected-text); border-color: var(--chip-unselected-border);'}
            >
{city.name}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Compare button -->
      <div class="flex justify-end">
        <button
          onclick={() => ejecutarComparacion()}
          disabled={!puedeComparar || cargando}
          type="button"
          class="flex items-center gap-2 text-white rounded-[10px] px-5 py-[10px] font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: var(--accent-primary);"
        >
          {#if cargando}
            <div
              class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
            ></div>
          {/if}
          Comparar
        </button>
      </div>
    </div>

    <!-- Global error -->
    {#if error}
      <div class="rounded-[16px] p-4" style="background-color: var(--color-error-soft);">
        <p class="font-body text-sm text-[var(--color-error)]">{error}</p>
      </div>
    {/if}

    <!-- Results -->
    {#if resultado}
      <!-- Successful cities -->
      {#if resultado.cities.length > 0}
        <div class="flex flex-col gap-4 w-full">
          <h2 class="font-display font-bold text-[22px] text-[var(--text-primary)]">Resultados</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {#each resultado.cities as weather (weather.city_id)}
              <WeatherCityCard {weather} />
            {/each}
          </div>
        </div>
      {/if}

      <!-- Error cities -->
      {#if resultado.errors && resultado.errors.length > 0}
        <div class="flex flex-col gap-4 w-full">
          <h2 class="font-display font-bold text-base text-[var(--color-error)]">
            Ciudades con error
          </h2>
          <div class="flex flex-col gap-3 w-full">
            {#each resultado.errors as errCity (errCity.city_id)}
              <ErrorCard
                cityName={errCity.city_name}
                errorMsg={errCity.error ?? 'No se pudo obtener datos'}
              />
            {/each}
          </div>
        </div>
      {/if}

      <!-- Summary panel -->
      <div class="flex flex-col gap-4 w-full">
        <h2 class="font-display font-bold text-[22px] text-[var(--text-primary)]">
          Resumen comparativo
        </h2>
        <SummaryPanel summary={resultado.summary} />
      </div>
    {/if}
  </main>
</div>
