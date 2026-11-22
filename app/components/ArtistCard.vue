<script setup lang="ts">
import type { ArtistEntry } from '#shared/types/artist'
import { DEFAULT_BG, useBgColors } from '~/composables/useBgColors'

const { entry } = defineProps<{ entry: ArtistEntry }>()
const bg = useBgColors()

const img = useTemplateRef<HTMLImageElement>('img')
const isLoaded = ref(false)

function onReady(): void {
  if (isLoaded.value) return
  isLoaded.value = true
}

// La photo peut finir de charger avant que Vue n'attache @load (rendu serveur, cache)
onMounted(() => {
  if (img.value?.complete) onReady()
})
</script>

<template>
  <article
    class="group relative aspect-square overflow-hidden rounded-[5px] bg-bg text-fg transition-[opacity,visibility] duration-300"
    :class="isLoaded ? 'visible opacity-100' : 'invisible opacity-0'"
    @mouseenter="bg = entry.bgColors"
    @mouseleave="bg = DEFAULT_BG"
  >
    <img
      ref="img"
      :src="entry.artist.imgUrls[0]"
      :alt="entry.artist.name"
      class="absolute inset-0 size-full object-cover grayscale-80 transition-[scale,filter] duration-300 ease-in-out group-hover:scale-140 group-hover:grayscale-0 pointer-coarse:grayscale-30"
      @load="onReady"
      @error="onReady"
    />
    <div class="relative flex flex-col p-2">
      <h2 class="text-[4rem] leading-tight max-[550px]:text-5xl">{{ entry.artist.name }}</h2>
      <ul class="flex flex-wrap">
        <li
          v-for="style in entry.artist.styles"
          :key="style"
          class="m-1 rounded-[5px] bg-bg/70 p-2 font-bold transition-colors duration-100 hover:bg-bg"
        >
          {{ style }}
        </li>
      </ul>
    </div>
    <span
      aria-hidden="true"
      class="absolute top-[55%] left-1/2 w-40 -translate-1/2 rounded-[5px] bg-white/80 p-3 text-center text-2xl text-fg-inverse opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      Show
    </span>
    <NuxtLink
      :to="`/artistes/${entry.slug}`"
      :aria-label="`Voir la fiche de ${entry.artist.name}`"
      class="absolute inset-0 rounded-[5px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg"
    />
  </article>
</template>
