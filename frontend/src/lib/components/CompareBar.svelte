<script lang="ts">
  import { CircleCheckBig, ArrowRight } from 'lucide-svelte'
  import { modoOscuro } from '$lib/stores/theme'

  interface Props {
    count: number
    onCompare: () => void
  }

  let { count, onCompare }: Props = $props()

  const deshabilitado = $derived(count < 2)
</script>

<div
  class="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between px-12 transition-colors duration-300"
  style="background-color: {$modoOscuro ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'}; border-top: 1px solid {$modoOscuro ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}; z-index: 50; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
>
  <!-- Left: selection count -->
  <div class="flex items-center gap-[10px]">
    <CircleCheckBig size={18} style="color: {$modoOscuro ? '#94a3b8' : '#2c5f7b'};" />
    <span class="font-body text-sm font-medium" style="color: {$modoOscuro ? '#f1f5f9' : '#1f2937'};">
      {count} {count === 1 ? 'ciudad seleccionada' : 'ciudades seleccionadas'}
    </span>
  </div>

  <!-- Right: compare button -->
  <button
    onclick={onCompare}
    disabled={deshabilitado}
    type="button"
    class="flex items-center gap-2 text-white rounded-[10px] px-6 py-[10px] font-body text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    style="background-color: {$modoOscuro ? 'rgba(100, 116, 139, 0.8)' : '#2c5f7b'};"
  >
    <ArrowRight size={16} />
    <span>Comparar</span>
  </button>
</div>
