<script lang="ts">
  import { TriangleAlert } from 'lucide-svelte'

  interface Props {
    cityName: string
    errorMsg?: string
  }

  let { cityName, errorMsg = 'No se pudo obtener datos' }: Props = $props()
</script>

<div
  class="rounded-[16px] p-4 flex items-center gap-3 w-full"
  style="background-color: var(--color-error-soft);"
>
  <div
    class="w-9 h-9 rounded-[10px] bg-[var(--bg-page)] flex items-center justify-center shrink-0"
  >
    <TriangleAlert size={18} class="text-[var(--color-error)]" />
  </div>
  <div class="flex flex-col gap-[2px] flex-1 min-w-0">
    <span class="font-display font-bold text-sm text-[var(--color-error)] truncate">{cityName}</span>
    <span class="font-body text-[12px] text-[var(--text-secondary)] truncate">{errorMsg}</span>
  </div>
</div>
