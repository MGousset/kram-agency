<script setup lang="ts">
const { id, color = '23ff5500' } = defineProps<{
  id: string // id numérique du morceau SoundCloud
  color?: string // couleur du bouton lecture
}>()

const isLoaded = ref(false)

const src = computed(() => {
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%${id}&color=%${color}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`
})
</script>

<template>
  <USkeleton v-show="!isLoaded" class="aspect-video w-full" />
  <div class="aspect-video w-full rounded-[5px]">
    <iframe
      v-show="isLoaded"
      class="size-full"
      scrolling="no"
      frameborder="no"
      allow="autoplay; encrypted-media"
      :src="src"
      @load="isLoaded = true"
    />
  </div>
</template>
