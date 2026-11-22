<script setup lang="ts">
import { useArtists } from '~/composables/useArtist'

useSeoMeta({ title: 'Artistes · Kram Agency' })
const { data: entries } = await useArtists()
</script>

<template>
  <main class="relative z-1 flex h-full w-full flex-col items-center overflow-x-hidden pb-12">
    <h1 class="mt-1 flex h-36 shrink-0 items-end justify-center text-fg">ARTISTES</h1>
    <div class="min-h-0 w-full flex-1 px-4 py-2.5">
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),450px))] justify-center gap-4"
      >
        <ArtistCard v-for="entry in entries" :key="entry.slug" :entry="entry" />
      </div>
    </div>
  </main>
</template>
