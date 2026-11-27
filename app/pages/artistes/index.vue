<script setup lang="ts">
import { useArtists } from '~/composables/useArtist'

useSeoMeta({ title: 'Artistes · Kram Agency' })
const { data: entries } = await useArtists()
</script>

<template>
  <main
    class="relative z-1 flex h-dvh w-full flex-col items-center justify-center overflow-x-hidden"
  >
    <div class="w-full px-4 py-2.5">
      <div
        class="relative top-1/2 grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),450px))] justify-center gap-4"
      >
        <ArtistCard
          v-for="entry in entries"
          :key="entry.slug"
          :entry="entry"
          class="-translate-y-1/2"
        />
      </div>
    </div>
  </main>
</template>
