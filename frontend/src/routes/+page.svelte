<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import NavHeader from '$lib/components/NavHeader.svelte'
  import CityCard from '$lib/components/CityCard.svelte'
  import CompareBar from '$lib/components/CompareBar.svelte'
  import { obtenerCiudades } from '$lib/api'
  import type { City } from '$lib/types'

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

<div class="min-h-screen flex flex-col" style="background-color: var(--bg-page);">
  <NavHeader variant="standard" />

  <!-- Main content -->
  <main class="flex-1 flex flex-col gap-8 px-12 py-10 pb-24">
    <!-- Title row -->
    <div class="flex items-end justify-between w-full">
      <div class="flex flex-col gap-2">
        <h1 class="font-display font-bold text-[32px] text-[var(--text-primary)]">Ciudades</h1>
        <p class="font-body text-sm text-[var(--text-secondary)]">
          Seleccioná ciudades para ver el clima o compararlas entre ellas
        </p>
      </div>
      <div
        class="flex items-center gap-[6px] rounded-[20px] px-[14px] py-[6px]"
        style="background-color: var(--accent-primary-soft);"
      >
        <span class="font-body text-sm font-medium text-[var(--accent-primary)]">
          {ciudades.length} ciudades
        </span>
      </div>
    </div>

    <!-- Estados de carga -->
    {#if cargando}
      <div class="flex items-center justify-center py-24">
        <div
          class="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"
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
      <p class="font-body text-sm text-[var(--text-secondary)] text-center py-12">
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
