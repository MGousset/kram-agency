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

const trackGroups = computed(() =>
  [
    { title: 'Records', id: artist.value.trackPlaylistId },
    { title: 'Productions', id: artist.value.prodPlaylistId },
  ].filter((group) => group.id),
)

const { copy } = useCopy()
</script>

<template>
  <main class="max-4/5 relative z-1 mx-auto w-3/5 min-w-90! pt-28 pb-20 text-fg">
    <NuxtLink to="/artistes" class="text-white/70 hover:text-white">← Artistes</NuxtLink>
    <div class="mt-4 flex flex-col rounded-[5px] bg-bg">
      <div class="flex flex-col">
        <div class="flex h-56 flex-col justify-between border-b-2 border-fg p-2">
          <div>
            <h1 class="text-5xl leading-tight">{{ artist.name }}</h1>
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

          <div class="mt-4 flex flex-wrap items-end justify-between">
            <div class="ml-0.5 flex items-end gap-4">
              <a
                v-if="artist.network?.insta"
                :href="artist.network.insta"
                target="_blank"
                :aria-label="`Instagram de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:instagram" class="flex size-8!" />
              </a>
              <a
                v-if="artist.network?.soundCloud"
                :href="artist.network.soundCloud"
                target="_blank"
                :aria-label="`SoundCloud de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:soundcloud" class="flex size-8!" />
              </a>
              <a
                v-if="artist.network?.youtube"
                :href="artist.network.youtube"
                target="_blank"
                :aria-label="`SoundCloud de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:youtube" class="flex size-8!" />
              </a>
              <a
                v-if="artist.network?.twitch"
                :href="artist.network.twitch"
                target="_blank"
                :aria-label="`SoundCloud de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:twitch" class="flex size-8!" />
              </a>
              <a
                v-if="artist.network?.linktree"
                :href="artist.network.linktree"
                target="_blank"
                :aria-label="`SoundCloud de ${artist.name}`"
                class="text-white/70 transition-colors hover:text-white"
              >
                <Icon name="simple-icons:linktree" class="flex size-8!" />
              </a>
            </div>

            <button
              type="button"
              class="flex w-24 cursor-pointer items-center justify-around rounded-[5px] bg-white p-2 text-fg-inverse transition-[translate,box-shadow] duration-100 hover:-translate-1 hover:shadow-[0.25rem_0.25rem_0_0_white]"
              @click="copy(BOOKING_EMAIL)"
            >
              <Icon name="lucide:mail" class="size-6" />
              <span class="font-bold">Email</span>
            </button>
          </div>
        </div>

        <div class="flex h-56 w-full">
          <LazyImageCarousel
            :urls="artist.imgUrls"
            :alt="artist.name"
            :image-center="artist.imageCenter"
          />
        </div>

        <div class="flex min-h-50 w-full flex-wrap justify-center border-t-2 border-fg">
          <section class="w-[50%] min-w-90 grow p-2">
            <h3 class="text-3xl">Bio</h3>
            <div class="flex w-full flex-col justify-center">
              <p v-for="(line, i) in artist.description" :key="i" class="text-justify">
                {{ line }}
              </p>
            </div>
          </section>

          <section v-for="group in trackGroups" :key="group.id" class="w-[50%] min-w-90 p-2">
            <h3 class="text-3xl">{{ group.title }}</h3>
            <div class="flex flex-col">
              <LazySoundCloudPlaylist v-if="group.id" :id="group.id" class="my-2" />
            </div>
          </section>

          <section v-if="artist.videoIds.length" class="min-w-90 grow p-2">
            <ArtistVideos :video-ids="artist.videoIds ?? []" />
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
