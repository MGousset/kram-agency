<script setup lang="ts">
const { urls, alt } = defineProps<{
  urls: string[]
  alt: string
}>()

const emit = defineEmits<{ loaded: [] }>()

const loadedByUrl = new Map<string, boolean>(urls.map((url) => [url, false]))
const areAllImageLoaded = ref(false)

function onReady(url: string): void {
  if (areAllImageLoaded.value) return
  loadedByUrl.set(url, true)

  areAllImageLoaded.value = loadedByUrl.values().every((isImgLoaded) => isImgLoaded)

  if (areAllImageLoaded.value) {
    emit('loaded')
  }
}
</script>

<template>
  <UMarquee
    :ui="{
      content: 'gap-0! p-0',
      root: `[--duration:60s] gap-0!`,
    }"
    :pause-on-hover="true"
    :overlay="false"
  >
    <img
      v-for="(url, i) in urls"
      :key="i"
      :src="url"
      :alt="i < urls.length ? `${alt}, photo ${i + 1}` : ''"
      :aria-hidden="i >= urls.length || undefined"
      class="h-full w-90 object-cover"
      @load="onReady(url)"
    />
  </UMarquee>
</template>
