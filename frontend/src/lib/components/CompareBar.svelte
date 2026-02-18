<script lang="ts">
  import { CircleCheckBig, ArrowRight } from 'lucide-svelte'

  interface Props {
    count: number
    onCompare: () => void
  }

  let { count, onCompare }: Props = $props()

  const deshabilitado = $derived(count < 2)
</script>

<div
  class="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between px-12 bg-[var(--home-card-bg)]"
  style="border-top: 1px solid var(--home-border); z-index: 50;"
>
  <!-- Left: selection count -->
  <div class="flex items-center gap-[10px]">
    <CircleCheckBig size={18} class="text-[var(--airforce-blue)]" />
    <span class="font-body text-sm font-medium text-[var(--home-text-dark)]">
      {count} {count === 1 ? 'ciudad seleccionada' : 'ciudades seleccionadas'}
    </span>
  </div>

  <!-- Right: compare button -->
  <button
    onclick={onCompare}
    disabled={deshabilitado}
    type="button"
    class="flex items-center gap-2 text-white rounded-[10px] px-6 py-[10px] font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    style="background-color: var(--yale-blue);"
  >
    <ArrowRight size={16} />
    <span>Comparar</span>
  </button>
</div>
