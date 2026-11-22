<script setup lang="ts">
import { useArtists } from '~/composables/useArtist'

useSeoMeta({ title: 'Kram Agency' })

const { data: entries } = useArtists({ server: false, lazy: true })

// Une fois la liste reçue, on demande les photos au navigateur
watch(entries, (list) => {
  for (const { artist } of list) {
    const imgUrl = artist.imgUrls[0]

    if (imgUrl) {
      new Image().src = imgUrl
    }
  }
})
</script>

<template>
  <h1 class="sr-only">Kram Agency, collectif et agence de DJs à Brest</h1>
</template>
