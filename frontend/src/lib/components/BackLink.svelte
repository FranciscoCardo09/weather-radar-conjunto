<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'
  import { modoOscuro } from '$lib/stores/theme'

  interface Props {
    href?: string
    label?: string
  }

  let { href = '/', label = 'Volver al inicio' }: Props = $props()
</script>

<a {href} class="flex items-center gap-[6px] w-fit hover:opacity-80 transition-opacity">
  <ArrowLeft size={18} style="color: {$modoOscuro ? '#94a3b8' : 'white'};" />
  <span class="font-body text-sm font-semibold" style="color: {$modoOscuro ? '#94a3b8' : 'white'};">{label}</span>
</a>
