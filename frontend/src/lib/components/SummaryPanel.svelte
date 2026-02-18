<script lang="ts">
  import { BarChart3, Flame, Trophy, Tag } from 'lucide-svelte'
  import type { WeatherSummary } from '$lib/types'

  interface Props {
    summary: WeatherSummary
  }

  let { summary }: Props = $props()
</script>

<div class="flex flex-col gap-6 w-full">
  <!-- Top row: Promedios + Extremos -->
  <div class="flex gap-4 w-full flex-col md:flex-row">
    <!-- Promedios -->
    <div class="flex-1 bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: var(--accent-primary);"
        >
          <BarChart3 size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm text-[var(--text-primary)]">Promedios</span>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Temperatura</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.average_temperature.toFixed(1)}°C</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Humedad</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.average_humidity.toFixed(1)}%</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Viento</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.average_wind_speed.toFixed(1)} km/h</span
          >
        </div>
      </div>
    </div>

    <!-- Extremos -->
    <div class="flex-1 bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: var(--accent-orange);"
        >
          <Flame size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm text-[var(--text-primary)]">Extremos</span>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Más caliente</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.hottest_city}</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Más fría</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.coldest_city}</span
          >
        </div>
        <div class="flex justify-between items-center">
          <span class="font-body text-sm text-[var(--text-secondary)]">Más ventosa</span>
          <span class="font-body text-sm font-semibold text-[var(--text-primary)]"
            >{summary.windiest_city}</span
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom row: Ranking + Agrupación -->
  <div class="flex gap-4 w-full flex-col md:flex-row">
    <!-- Ranking por temperatura -->
    <div class="flex-1 bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: var(--accent-orange);"
        >
          <Trophy size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm text-[var(--text-primary)]"
          >Ranking por temperatura</span
        >
      </div>
      <div class="flex flex-col gap-1">
        {#each summary.ranking as city, i}
          <div
            class="flex items-center justify-between rounded-[8px] px-3 py-2 transition-colors"
            style={i === 0 ? 'background-color: var(--rank-first-bg);' : ''}
          >
            <div class="flex items-center gap-3">
              <span class="font-body text-sm font-semibold text-[var(--text-tertiary)] w-5"
                >{i + 1}</span
              >
              <span class="font-body text-sm text-[var(--text-primary)]">{city}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Agrupación por condición -->
    <div class="flex-1 bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-[6px] flex items-center justify-center"
          style="background-color: var(--accent-teal);"
        >
          <Tag size={14} color="white" />
        </div>
        <span class="font-display font-bold text-sm text-[var(--text-primary)]"
          >Agrupación por condición</span
        >
      </div>
      <div class="flex flex-col gap-3">
        {#each Object.entries(summary.by_condition) as [condition, cities]}
          <div class="flex flex-col gap-[2px]">
            <span class="font-body text-sm font-medium text-[var(--text-secondary)]"
              >{condition}</span
            >
            <span class="font-body text-sm text-[var(--text-tertiary)]">{cities.join(', ')}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
