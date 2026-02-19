<script lang="ts">
  import { BarChart3, Flame, Trophy, Tag } from 'lucide-svelte'
  import type { WeatherSummary } from '$lib/types'
  import { modoOscuro } from '$lib/stores/theme'

  interface Props {
    summary: WeatherSummary
  }

  let { summary }: Props = $props()
</script>

<div class="flex flex-col gap-6 w-full">
  <!-- Top row: Promedios + Extremos -->
  <div class="flex gap-4 w-full flex-col md:flex-row">
    <!-- Promedios -->
    <div class="flex-1 rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-300" style="{$modoOscuro ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: {$modoOscuro ? 'rgba(100, 116, 139, 0.6)' : 'rgba(255, 255, 255, 0.25)'};"
        >
          <BarChart3 size={14} style="color: {$modoOscuro ? '#94a3b8' : 'white'};" />
        </div>
        <span class="font-display font-bold text-sm" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">Promedios</span>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Temperatura</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.average_temperature.toFixed(1)}°C</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Humedad</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.average_humidity.toFixed(1)}%</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Viento</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.average_wind_speed.toFixed(1)} km/h</span
          >
        </div>
      </div>
    </div>

    <!-- Extremos -->
    <div class="flex-1 rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-300" style="{$modoOscuro ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: rgba(251, 146, 60, 0.8);"
        >
          <Flame size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">Extremos</span>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Más caliente</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.hottest_city}</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Más fría</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.coldest_city}</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};">Más ventosa</span>
          <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
            >{summary.windiest_city}</span
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom row: Ranking + Agrupación -->
  <div class="flex gap-4 w-full flex-col md:flex-row">
    <!-- Ranking por temperatura -->
    <div class="flex-1 rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-300" style="{$modoOscuro ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: rgba(251, 146, 60, 0.8);"
        >
          <Trophy size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
          >Ranking por temperatura</span
        >
      </div>
      <div class="flex flex-col gap-1">
        {#each summary.ranking as city, i}
          <div
            class="flex items-center justify-between rounded-[8px] px-3 py-2 transition-colors"
            style={i === 0 ? ($modoOscuro ? 'background-color: rgba(51, 65, 85, 0.5);' : 'background-color: rgba(255, 255, 255, 0.15);') : ''}
          >
            <div class="flex items-center gap-3">
              <span class="font-body text-sm font-semibold w-5" style="color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)'};"
                >{i + 1}</span
              >
              <span class="font-body text-sm" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};">{city}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Agrupación por condición -->
    <div class="flex-1 rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-300" style="{$modoOscuro ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: rgba(20, 184, 166, 0.8);"
        >
          <Tag size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
          >Agrupación por condición</span
        >
      </div>
      <div class="flex flex-col gap-3">
        {#each Object.entries(summary.by_condition) as [condition, cities]}
          <div class="flex flex-col gap-[2px]">
            <span class="font-body text-sm font-medium" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};"
              >{condition}</span
            >
            <span class="font-body text-sm" style="color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)'};">{ cities.join(', ')}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
