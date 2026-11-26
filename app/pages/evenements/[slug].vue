<script setup lang="ts">
import { formatEventDate } from '~/utils/date'

const route = useRoute()
const { data: event } = await useFetch(() => `/api/events/${route.params.slug}`)
if (!event.value) {
  throw createError({ statusCode: 404, statusMessage: 'Événement introuvable', fatal: true })
}
const e = computed(() => event.value!)

useSeoMeta({
  title: () => `${e.value.name} · Kram Agency`,
  description: () => `${formatEventDate(e.value.date)} · ${e.value.location}`,
  ogImage: () => e.value.photos[0],
})
</script>

<template>
  <main class="relative z-1 h-dvh overflow-y-auto text-fg">
    <div class="mx-auto max-w-5xl px-4 pt-28 pb-20">
      <NuxtLink to="/evenements" class="text-white/70 hover:text-white">← Événements</NuxtLink>

      <header class="mt-4 border-b-2 border-fg pb-4">
        <time :datetime="e.date" class="text-white/70">{{ formatEventDate(e.date) }}</time>
        <h1 class="text-[4rem] leading-tight max-[550px]:text-[2.5rem]">{{ e.name }}</h1>
        <p class="text-xl">{{ e.location }}</p>
        <ul class="mt-2 flex flex-wrap gap-1">
          <li
            v-for="style in e.styles"
            :key="style"
            class="rounded-[5px] bg-white/70 px-2 py-1 font-bold text-black"
          >
            {{ style }}
          </li>
        </ul>
        <p v-if="e.guests.length" class="mt-3">
          Line-up :
          {{ e.guests.join(', ') }}
        </p>
      </header>

      <section v-if="e.videos.length" class="mt-8">
        <h2 class="text-5xl">Vidéos</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <video
            v-for="v in e.videos"
            :key="v.url"
            :src="v.url"
            :poster="v.poster"
            controls
            playsinline
            preload="none"
            class="w-full rounded-[5px] bg-black"
          />
        </div>
      </section>

      <section v-if="e.photos.length" class="mt-8">
        <h2 class="text-5xl">Photos</h2>
        <div class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          <img
            v-for="(url, i) in e.photos"
            :key="url"
            :src="url"
            :alt="`${e.name}, photo ${i + 1}`"
            loading="lazy"
            class="aspect-square w-full rounded-[5px] object-cover"
          />
        </div>
      </section>
    </div>
  </main>
</template>
