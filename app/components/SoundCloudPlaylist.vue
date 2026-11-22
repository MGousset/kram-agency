<script setup lang="ts">
const { id, color = '23ff5500' } = defineProps<{
  id: string // id numérique du morceau SoundCloud
  color?: string // couleur du bouton lecture
}>()

const emit = defineEmits<{ loaded: [] }>()

const src = computed(() => {
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%${id}&color=%${color}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
})
</script>

<template>
  <iframe
    width="100%"
    height="300"
    scrolling="no"
    frameborder="no"
    allow="autoplay; encrypted-media"
    :src="src"
    @load="emit('loaded')"
  />
</template>
