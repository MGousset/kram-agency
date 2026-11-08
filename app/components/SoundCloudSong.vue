<script setup lang="ts">
const { id, color = '#ffffff' } = defineProps<{
  id: string // id numérique du morceau SoundCloud
  color?: string // couleur du bouton lecture
}>()

const emit = defineEmits<{ loaded: [] }>()

const src = computed(() => {
  const params = new URLSearchParams({
    url: `https://api.soundcloud.com/tracks/soundcloud%3Atracks%3A${id}`,
    color,
    inverse: 'true',
    auto_play: 'false',
    show_user: 'true',
  })
  return `https://w.soundcloud.com/player/?${params}`
})
</script>

<template>
  <!-- eager obligatoire : l'iframe est dans une section cachée tant qu'elle n'a pas chargé -->
  <iframe
    :src="src"
    title="Lecteur SoundCloud"
    loading="eager"
    class="block h-5 w-full border-0"
    @load="emit('loaded')"
  />
</template>
