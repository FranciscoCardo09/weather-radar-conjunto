<script lang="ts">
  import { CloudSun } from 'lucide-svelte'
  import type { CityWeather } from '$lib/types'
  import { modoOscuro } from '$lib/stores/theme'

  interface Props {
    weather: CityWeather
  }

  let { weather }: Props = $props()
</script>

<div class="rounded-[20px] p-5 flex flex-col gap-4 w-full transition-all duration-300" style="{$modoOscuro ? 'background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : 'background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'}">
  <!-- Header: icon + city name + condition -->
  <div class="flex items-center gap-3 w-full">
    <div
      class="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
      style="background-color: {$modoOscuro ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.2)'};"
    >
      <CloudSun size={22} style="color: {$modoOscuro ? '#94a3b8' : 'white'};" />
    </div>
    <div class="flex flex-col gap-[2px] flex-1 min-w-0">
      <span class="font-display font-bold text-base truncate" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
        >{weather.city_name}</span
      >
      <span class="font-body text-[13px] truncate" style="color: {$modoOscuro ? '#cbd5e1' : 'rgba(255, 255, 255, 0.8)'};"
        >{weather.condition}</span
      >
    </div>
  </div>

  <!-- Metrics grid -->
  <div class="flex gap-2 w-full">
    <div
      class="flex-1 flex flex-col items-center gap-1 rounded-[12px] py-3 px-[10px]"
      style="background-color: {$modoOscuro ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.15)'};"
    >
      <span class="font-display font-extrabold text-[20px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
        >{weather.temperature}°C</span
      >
      <span class="font-body text-[11px] font-medium" style="color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.8)'};">Temp</span>
    </div>
    <div
      class="flex-1 flex flex-col items-center gap-1 rounded-[12px] py-3 px-[10px]"
      style="background-color: {$modoOscuro ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.15)'};"
    >
      <span class="font-display font-extrabold text-[20px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
        >{weather.humidity}%</span
      >
      <span class="font-body text-[11px] font-medium" style="color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.8)'};">Humedad</span>
    </div>
    <div
      class="flex-1 flex flex-col items-center gap-1 rounded-[12px] py-3 px-[10px]"
      style="background-color: {$modoOscuro ? 'rgba(51, 65, 85, 0.6)' : 'rgba(255, 255, 255, 0.15)'};"
    >
      <span class="font-display font-extrabold text-[20px]" style="color: {$modoOscuro ? '#f1f5f9' : 'white'};"
        >{weather.wind_speed} km/h</span
      >
      <span class="font-body text-[11px] font-medium" style="color: {$modoOscuro ? '#94a3b8' : 'rgba(255, 255, 255, 0.8)'};">Viento</span>
    </div>
  </div>
</div>
