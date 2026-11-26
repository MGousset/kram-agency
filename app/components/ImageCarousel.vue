<script setup lang="ts">
const { urls, alt } = defineProps<{
  urls: string[]
  alt: string
}>()

const duration = 10 * urls.length
console.log(duration)
</script>

<template>
  <UMarquee
    :ui="{
      content: 'gap-0! p-0',
      root: `[--duration:${duration}s] gap-0!`,
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
    />
  </UMarquee>
</template>
