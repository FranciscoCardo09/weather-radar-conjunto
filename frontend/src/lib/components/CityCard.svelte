<script lang="ts">
  import { MapPin, Globe, Navigation } from 'lucide-svelte'
  import type { City } from '$lib/types'

  interface Props {
    city: City
    selected?: boolean
    onToggle?: () => void
  }

  let { city, selected = false, onToggle }: Props = $props()

  function formatearCoordenadas(lat: number, lon: number): string {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  }

  // Mapeo de imágenes de ciudades desde Google
  const imagenesDeciudades: Record<string, string> = {
    buenosaires: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
    cordoba: 'https://prensa.cba.gov.ar/wp-content/uploads/2020/07/Turismo-Champaqu%C3%AD-9.jpg',
    rosario: 'https://www.afa.com.ar/n/media/manager/1000/750/c/aHR0cHM6Ly93d3cuYWZhLmNvbS5hci91cGxvYWQvdGVzdC9tdXJhbC5qcGc_',
    mendoza: 'https://www.catadelvino.com/uploads/281201514034197247s.jpg',
    la_plata: 'https://turismo.laplata.gob.ar/img/la-ciudad/plaza_morenocatedral-1024x684.jpg',
    mar_del_plata: 'https://www.mardelplata.gob.ar/sites/default/files/texto_slide/MDP2.jpg',
    san_miguel_de_tucuman: 'https://comunicacionsmt.gob.ar/download/multimedia.miniatura.4695c074-0668-4fbb-832d-47a918e86c83.webp',
    salta: 'https://pohcdn.com/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/Salta.jpg',
    santa_fe: 'https://ceresciudad.com/wp-content/uploads/2022/01/turismo-santa-fe.jpg',
    corrientes: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Puente_General_Manuel_Belgrano.jpg',
    neuquen: 'https://www.amerian.com/wp-content/uploads/2025/01/DSC07952_1-1-1200x802-1-1024x684.jpg',
    resistencia: 'https://www.plataforma10.com.ar/viajes/wp-content/uploads/2023/05/resistencia.webp',
    posadas: 'https://turismomisiones.com.ar/wp-content/uploads/2025/06/Posadas.jpeg',
    bariloche: 'https://aquidepaso.com/wp-content/uploads/2022/07/que-hacer-en-bariloche.jpg',
    ushuaia: 'https://www.infodeushuaia.com/var/skiencerrocastor_com/storage/images/excursiones/navegacion-canal-beagle/navegacion-pingueinera/1606-171-esl-AR/Navegacion-Pingueinera.jpg'
  }

  function obtenerImagenDeCiudad(cityId: string): string {
    return imagenesDeciudades[cityId] || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80'
  }

  // Determinar la clase CSS según el estado (Svelte 5 runes)
  const claseVolteada = $derived(selected ? 'flip-card-selected' : '')
</script>

<!-- Todas las cards tienen el mismo diseño, solo cambia si están volteadas permanentemente -->
<div class="flip-card w-full min-h-[140px] {claseVolteada}">
  <div class="flip-card-inner">
    <!-- Front: Default card -->
    <div
      class="flip-card-front bg-[var(--home-card-bg)] rounded-[14px] p-5 flex flex-col gap-[6px] w-full relative shadow-lg"
    >
      <!-- Content -->
      <div class="flex flex-col gap-[6px] w-full">
        <button
          onclick={onToggle}
          type="button"
          class="font-display font-bold text-base text-[var(--home-text-dark)] text-left cursor-pointer hover:text-[var(--airforce-blue)] transition-colors"
        >
          {city.name}
        </button>
        <span class="font-body text-[12px] text-[var(--home-text-light)]">
          {formatearCoordenadas(city.latitude, city.longitude)}
        </span>
        <a
          href="/weather/{city.id}"
          class="flex items-center gap-1"
          onclick={(e) => e.stopPropagation()}
        >
          <MapPin size={11} class="text-[var(--home-text-light)]" />
          <span class="font-body text-[12px] font-medium text-[var(--airforce-blue)]">Ver clima →</span>
        </a>
      </div>
      
      <!-- Barra decorativa inferior -->
      <div class="absolute bottom-0 left-0 right-0 h-2 rounded-b-[14px]" style="background-color: #7f9c96;"></div>
    </div>

    <!-- Back: Imagen de ciudad (clickeable completo) -->
    <button
      onclick={onToggle}
      type="button"
      class="flip-card-back relative rounded-[14px] overflow-hidden cursor-pointer text-left w-full border-transparent shadow-lg"
      style="background-image: url('{obtenerImagenDeCiudad(city.id)}'); background-size: cover; background-position: center;"
      aria-pressed={selected}
      aria-label="{selected ? 'Deseleccionar' : 'Seleccionar'} {city.name}"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
      <div class="relative z-10 p-5 flex flex-col justify-between h-full">
        <div class="flex items-center gap-2">
          <Globe size={14} class="text-white opacity-90" />
          <span class="font-body text-[10px] text-white opacity-90 uppercase tracking-wider font-semibold">
            {selected ? 'Seleccionada' : 'Ubicación'}
          </span>
        </div>
        
        <div>
          <h3 class="font-display font-bold text-base text-white mb-2 drop-shadow-lg">{city.name}</h3>
          <span class="font-body text-[12px] text-white font-medium drop-shadow">
            {formatearCoordenadas(city.latitude, city.longitude)}
          </span>
        </div>

        <a
          href="/weather/{city.id}"
          class="flex items-center gap-1"
          onclick={(e) => e.stopPropagation()}
        >
          <MapPin size={11} class="text-white opacity-90" />
          <span class="font-body text-[12px] font-medium text-white drop-shadow">Ver clima →</span>
        </a>
      </div>
    </button>
  </div>
</div>

<style>
  .flip-card {
    perspective: 1000px;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: inherit;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  /* Hover solo funciona en cards NO seleccionadas */
  .flip-card:not(.flip-card-selected):hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  /* Cuando está seleccionada, mantener permanentemente volteada sin hover */
  .flip-card-selected .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    min-height: inherit;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }
</style>
