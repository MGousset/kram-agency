<script setup lang="ts">
import { useBgColors } from '~/composables/useBgColors'

const route = useRoute()
const { data: entry } = await useFetch(() => `/api/artists/${route.params.slug}`)
if (!entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artiste introuvable', fatal: true })
}
const artist = computed(() => entry.value!.artist)

const bg = useBgColors()
onMounted(() => (bg.value = entry.value!.bgColors))

useSeoMeta({
  title: () => `${artist.value.name} · Kram Agency`,
  description: () => artist.value.description[0],
  ogImage: () => artist.value.imgUrls[0],
})

const loadedIds = ref(new Set<string>())
const trackGroups = computed(() =>
  [
    { title: 'Sets', ids: artist.value.trackIds },
    { title: 'Productions', ids: artist.value.prodIds },
  ].filter((group) => group.ids.length),
)
const isGroupLoaded = (ids: string[]) => ids.every((id) => loadedIds.value.has(id))

const { copy } = useCopy()
</script>

<template>
  <main class="relative z-1 mx-auto max-w-4xl px-4 pt-28 pb-20 text-fg">
    <NuxtLink to="/artistes" class="text-white/70 hover:text-white">← Artistes</NuxtLink>
    <div class="mt-4 flex flex-col bg-bg">
      <div class="flex flex-col">
        <div class="flex h-56 flex-col justify-between border-b-2 border-fg p-4">
          <div>
            <h1 class="text-[4rem] leading-tight max-[550px]:text-[2rem]">{{ artist.name }}</h1>
            <ul class="flex flex-wrap items-end">
              <li
                v-for="style in artist.styles"
                :key="style"
                class="my-1 mr-1 rounded-[5px] bg-white/70 p-2 font-bold text-black transition-colors duration-100 hover:bg-white"
              >
                {{ style }}
              </li>
            </ul>
          </div>

          <div class="flex items-end justify-between">
            <div class="ml-0.5 flex items-end gap-4">
              <a
                v-if="artist.network?.insta"
                :href="artist.network.insta"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Instagram de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:instagram" class="size-8" />
              </a>
              <a
                v-if="artist.network?.soundCloud"
                :href="artist.network.soundCloud"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`SoundCloud de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:soundcloud" class="size-8" />
              </a>
            </div>

            <button
              type="button"
              class="mt-4 flex w-40 cursor-pointer items-center justify-around rounded-[5px] bg-white p-3 text-fg-inverse transition-[translate,box-shadow] duration-100 hover:-translate-1 hover:shadow-[0.25rem_0.25rem_0_0_white]"
              @click="copy(BOOKING_EMAIL)"
            >
              <Icon name="lucide:mail" class="size-6" />
              <span class="text-2xl">Email</span>
            </button>
          </div>
        </div>

        <div class="flex h-56">
          <img
            v-for="url in artist.imgUrls"
            :key="url"
            :src="url"
            :alt="artist.name"
            class="size-full min-w-0 flex-1 object-cover"
            :style="{ objectPosition: `50% ${artist.imageCenter}%` }"
          />
        </div>

        <div class="flex min-h-75 flex-wrap justify-center border-t-2 border-fg bg-black/40 p-2">
          <section
            v-for="group in trackGroups"
            v-show="isGroupLoaded(group.ids)"
            :key="group.title"
            class="min-w-[min(300px,100%)] grow p-2"
          >
            <h3 class="text-5xl">{{ group.title }}</h3>
            <div class="flex flex-col">
              <LazySoundCloudSong
                v-for="id in group.ids"
                :id="id"
                :key="id"
                class="my-2"
                @loaded="loadedIds.add(id)"
              />
            </div>
          </section>

          <section class="min-w-[min(300px,100%)] grow p-2">
            <h3 class="text-5xl">Bio</h3>
            <div class="flex max-w-100 flex-col justify-center">
              <p v-for="(line, i) in artist.description" :key="i">{{ line }}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
