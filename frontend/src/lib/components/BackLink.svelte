<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'
  interface Props {
    href?: string
    label?: string
  }

  let { href = '/', label = 'Volver al inicio' }: Props = $props()
</script>

<a {href} class="flex items-center gap-[6px] w-fit hover:opacity-80 transition-opacity">
  <ArrowLeft size={18} class="text-[var(--text-secondary)]" />
  <span class="font-body text-sm font-semibold text-[var(--text-secondary)]">{label}</span>
</a>
