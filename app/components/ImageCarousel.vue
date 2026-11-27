<script setup lang="ts">
const { urls, alt } = defineProps<{
  urls: string[]
  alt: string
}>()

const loadedByUrl = new Map<string, boolean>(urls.map((url) => [url, false]))
const areAllImageLoaded = ref(false)

function setUrlReady(url: string): void {
  loadedByUrl.set(url, true)

  areAllImageLoaded.value = loadedByUrl.values().every((isImgLoaded) => isImgLoaded)
}
</script>

<template>
  <div class="h-full w-full">
    <USkeleton v-show="!areAllImageLoaded" class="h-full w-full rounded-none" />
    <UMarquee
      v-show="areAllImageLoaded"
      :ui="{
        content: 'gap-0! p-0',
        root: `[--duration:60s] gap-0!`,
      }"
      :pause-on-hover="true"
      :overlay="false"
      :image-center="50"
      class="h-full w-full"
    >
      <div v-for="(url, i) in urls" :key="i" class="h-full w-90">
        <img
          :src="url"
          :alt="i < urls.length ? `${alt}, photo ${i + 1}` : ''"
          :aria-hidden="i >= urls.length || undefined"
          class="h-full w-90 object-cover"
          @load="setUrlReady(url)"
        />
      </div>
    </UMarquee>
  </div>
</template>
