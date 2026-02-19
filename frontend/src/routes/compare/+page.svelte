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
  import { modoOscuro } from '$lib/stores/theme'

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

<div class="min-h-screen flex flex-col relative overflow-hidden">
  <!-- Video de fondo de toda la página (siempre visible) -->
  <video
    autoplay
    loop
    muted
    playsinline
    class="fixed inset-0 w-full h-full object-cover"
    style="z-index: 0;"
  >
    <source src="https://v1.pinimg.com/videos/mc/720p/a8/72/5b/a8725bfe4a191427e84dd151f664f90f.mp4" type="video/mp4" />
  </video>
  
  <!-- Overlay con transparencia dinámica según el tema -->
  <div class="fixed inset-0 transition-colors duration-300" style="background-color: {$modoOscuro ? 'rgba(15, 23, 42, 0.85)' : 'rgba(107, 114, 128, 0.6)'}; z-index: 1;"></div>
  
  <NavHeader variant="home" />

  <main class="flex flex-col gap-8 px-12 py-10 relative z-10">
    <BackLink href="/" />

    <!-- Title -->
    <div class="flex flex-col gap-1">
      <h1 class="font-display font-bold text-[28px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">
        Comparar ciudades
      </h1>
      <p class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'white'};">
        Seleccioná las ciudades que querés comparar
      </p>
    </div>

    <!-- City selector section -->
    <div
      class="rounded-[20px] p-6 flex flex-col gap-4 w-full transition-all duration-300"
      style="{$modoOscuro 
        ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' 
        : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}"
    >
      <span class="font-display font-bold text-base" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">
        Ciudades disponibles
      </span>

      {#if cargandoCiudades}
        <div class="flex items-center gap-2">
          <div
            class="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style="border-color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.8)'}; border-top-color: transparent;"
          ></div>
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'white'};">Cargando ciudades…</span>
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
              style={$modoOscuro
                ? (isSelected ? 'background-color: rgba(100, 116, 139, 0.5); color: #f1f5f9; border-color: rgba(148, 163, 184, 0.5);' : 'background-color: rgba(51, 65, 85, 0.5); color: #cbd5e1; border-color: rgba(100, 116, 139, 0.3);')
                : (isSelected ? 'background-color: rgba(255, 255, 255, 0.3); color: white; border-color: rgba(255, 255, 255, 0.5);' : 'background-color: rgba(255, 255, 255, 0.1); color: white; border-color: rgba(255, 255, 255, 0.3);')}
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
          class="flex items-center gap-2 rounded-[10px] px-5 py-[10px] font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: {$modoOscuro ? 'rgba(100, 116, 139, 0.6)' : 'rgba(255, 255, 255, 0.25)'}; color: {$modoOscuro ? '#f1f5f9' : 'white'};"
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
      <div class="rounded-[16px] p-4 transition-all duration-300" style="{$modoOscuro ? 'background: rgba(153, 27, 27, 0.3); border: 1px solid rgba(239, 68, 68, 0.4);' : 'background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3);'}">
        <p class="font-body text-sm" style="color: {$modoOscuro ? '#fca5a5' : 'white'};">{error}</p>
      </div>
    {/if}

    <!-- Results -->
    {#if resultado}
      <!-- Successful cities -->
      {#if resultado.cities.length > 0}
        <div class="flex flex-col gap-4 w-full">
          <h2 class="font-display font-bold text-[22px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">Resultados</h2>
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
          <h2 class="font-display font-bold text-base" style="color: {$modoOscuro ? '#fca5a5' : '#fca5a5'};">
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
        <h2 class="font-display font-bold text-[22px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">          Resumen comparativo
        </h2>
        <SummaryPanel summary={resultado.summary} />
      </div>
    {/if}
  </main>
</div>
