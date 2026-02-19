<script lang="ts">
  import { CloudSun } from 'lucide-svelte'
  import type { CityWeather } from '$lib/types'

  interface Props {
    weather: CityWeather
  }

  let { weather }: Props = $props()
</script>

<div class="bg-[var(--bg-card)] rounded-[16px] p-5 flex flex-col gap-4 w-full">
  <!-- Header: icon + city name + condition -->
  <div class="flex items-center gap-3 w-full">
    <div
      class="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
      style="background-color: var(--accent-primary-soft);"
    >
      <CloudSun size={22} class="text-[var(--accent-primary)]" />
    </div>
    <div class="flex flex-col gap-[2px] flex-1 min-w-0">
      <span class="font-display font-bold text-base text-[var(--text-primary)] truncate"
        >{weather.city_name}</span
      >
      <span class="font-body text-[13px] text-[var(--text-secondary)] truncate"
        >{weather.condition}</span
      >
    </div>
  </div>

  <!-- Metrics grid -->
  <div class="flex gap-2 w-full">
    <div
      class="flex-1 flex flex-col items-center gap-1 bg-[var(--metric-card-bg)] rounded-[12px] py-3 px-[10px]"
    >
      <span class="font-display font-extrabold text-[20px] text-[var(--text-primary)]"
        >{weather.temperature}°C</span
      >
      <span class="font-body text-[11px] font-medium text-[var(--text-secondary)]">Temp</span>
    </div>
    <div
      class="flex-1 flex flex-col items-center gap-1 bg-[var(--metric-card-bg)] rounded-[12px] py-3 px-[10px]"
    >
      <span class="font-display font-extrabold text-[20px] text-[var(--text-primary)]"
        >{weather.humidity}%</span
      >
      <span class="font-body text-[11px] font-medium text-[var(--text-secondary)]">Humedad</span>
    </div>
    <div
      class="flex-1 flex flex-col items-center gap-1 bg-[var(--metric-card-bg)] rounded-[12px] py-3 px-[10px]"
    >
      <span class="font-display font-extrabold text-[20px] text-[var(--text-primary)]"
        >{weather.wind_speed} km/h</span
      >
      <span class="font-body text-[11px] font-medium text-[var(--text-secondary)]">Viento</span>
    </div>
  </div>
</div>
