<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import NavHeader from '$lib/components/NavHeader.svelte'
  import CityCard from '$lib/components/CityCard.svelte'
  import CompareBar from '$lib/components/CompareBar.svelte'
  import { obtenerCiudades } from '$lib/api'
  import type { City } from '$lib/types'
  import { modoOscuro } from '$lib/stores/theme'

  let ciudades = $state<City[]>([])
  let idsSeleccionados = $state<Set<string>>(new Set())
  let cargando = $state(true)
  let error = $state<string | null>(null)

  const cantidadSeleccionados = $derived(idsSeleccionados.size)
  const mostrarBarraComparar = $derived(cantidadSeleccionados >= 1)

  onMount(async () => {
    try {
      ciudades = await obtenerCiudades()
    } catch (e) {
      error = e instanceof Error ? e.message : 'No se pudo conectar con el servidor'
    } finally {
      cargando = false
    }
  })

  function alternarCiudad(id: string): void {
    const nuevosIds = new Set(idsSeleccionados)
    
    if (nuevosIds.has(id)) {
      nuevosIds.delete(id)
    } else {
      // maximo 50 ciudades
      if (nuevosIds.size >= 50) return
      nuevosIds.add(id)
    }
    
    idsSeleccionados = nuevosIds
  }

  function irAComparar(): void {
    if (cantidadSeleccionados < 2) return
    
    const ids = [...idsSeleccionados].join(',')
    goto(`/compare?ids=${ids}`)
  }
</script>

<svelte:head>
  <title>Ciudades – Weather Radar</title>
</svelte:head>

<div class="min-h-screen flex flex-col relative overflow-hidden">
  <!-- Video de fondo de toda la página (siempre visible) -->
  <video
    autoplay
    loop
    muted
    playsinline
    preload="auto"
    class="fixed inset-0 w-full h-full object-cover"
    style="z-index: 0;"
  >
    <source src="https://v1.pinimg.com/videos/mc/720p/a8/72/5b/a8725bfe4a191427e84dd151f664f90f.mp4" type="video/mp4" />
  </video>
  
  <!-- Overlay con transparencia dinámica según el tema -->
  <div class="fixed inset-0 transition-colors duration-300" style="background-color: {$modoOscuro ? 'rgba(15, 23, 42, 0.85)' : 'rgba(107, 114, 128, 0.6)'}; z-index: 1;"></div>
  
  <NavHeader variant="home" />

  <!-- Main content -->
  <main class="flex-1 flex flex-col gap-8 px-12 py-10 pb-24 relative z-10">
    <!-- Title row -->
    <div class="flex items-end justify-between w-full">
      <div class="flex flex-col gap-2">
        <h1 class="font-display font-bold text-[32px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">Ciudades</h1>
        <p class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'white'};">
          Seleccioná ciudades para ver el clima o compararlas entre ellas
        </p>
      </div>
      <div
        class="flex items-center gap-[6px] rounded-[20px] px-[14px] py-[6px]"
        style="background-color: {$modoOscuro ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255,255,255,0.15)'};"
      >
        <span class="font-body text-sm font-medium" style="color: {$modoOscuro ? '#94a3b8' : 'white'};">
          {ciudades.length} ciudades
        </span>
      </div>
    </div>

    <!-- Estados de carga -->
    {#if cargando}
      <div class="flex items-center justify-center py-24">
        <div
          class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style="border-color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.8)'}; border-top-color: transparent;"
        ></div>
      </div>
    {:else if error}
      <div
        class="rounded-[16px] p-6 text-center"
        style="background-color: var(--color-error-soft);"
      >
        <p class="font-body text-sm text-[var(--color-error)]">{error}</p>
        <button
          onclick={() => location.reload()}
          class="mt-3 font-body text-sm font-semibold text-[var(--color-error)] underline"
          type="button"
        >
          Reintentar
        </button>
      </div>
    {:else if ciudades.length === 0}
      <p class="font-body text-sm text-[var(--home-text-light)] text-center py-12">
        No hay ciudades disponibles
      </p>
    {:else}
      <!-- Grilla de ciudades: 5 columnas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {#each ciudades as ciudad (ciudad.id)}
          <CityCard
            city={ciudad}
            selected={idsSeleccionados.has(ciudad.id)}
            onToggle={() => alternarCiudad(ciudad.id)}
          />
        {/each}
      </div>
    {/if}
  </main>

  <!-- Barra de comparación -->
  {#if mostrarBarraComparar}
    <CompareBar count={cantidadSeleccionados} onCompare={irAComparar} />
  {/if}
</div>
