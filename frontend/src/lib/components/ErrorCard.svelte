<script lang="ts">
  import { TriangleAlert } from 'lucide-svelte'
  import { modoOscuro } from '$lib/stores/theme'

  interface Props {
    cityName: string
    errorMsg?: string
  }

  let { cityName, errorMsg = 'No se pudo obtener datos' }: Props = $props()
</script>

<div
  class="rounded-[16px] p-4 flex items-center gap-3 w-full transition-all duration-300"
  style="{$modoOscuro ? 'background: rgba(153, 27, 27, 0.3); border: 1px solid rgba(239, 68, 68, 0.4);' : 'background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3);'}"
>
  <div
    class="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
    style="background: {$modoOscuro ? 'rgba(127, 29, 29, 0.5)' : 'rgba(255, 255, 255, 0.2)'};"
  >
    <TriangleAlert size={18} style="color: {$modoOscuro ? '#fca5a5' : 'white'};" />
  </div>
  <div class="flex flex-col gap-[2px] flex-1 min-w-0">
    <span class="font-display font-bold text-sm truncate" style="color: {$modoOscuro ? '#fca5a5' : 'white'};">{cityName}</span>
    <span class="font-body text-[12px] truncate" style="color: {$modoOscuro ? '#fecaca' : 'rgba(255, 255, 255, 0.8)'};">{ errorMsg}</span>
  </div>
</div>
