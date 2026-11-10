<script setup lang="ts">
import { BOOKING_EMAIL } from '~/utils/constants'
import type { Artist } from '#shared/types/artist'

// Deux racines (carte + dialog) : class/style du parent vont sur la carte
defineOptions({ inheritAttrs: false })

const props = defineProps<Artist>()
const emit = defineEmits<{ focusImage: [id: string | undefined] }>()

const isOpen = ref(false)
const shouldLoadTracks = ref(false)
const loadedIds = ref(new Set<string>())

const trackGroups = computed(() =>
  [
    { title: 'Sets', ids: props.trackIds },
    { title: 'Productions', ids: props.prodIds },
  ].filter((group) => group.ids.length),
)

const isGroupLoaded = (ids: string[]) => ids.every((id) => loadedIds.value.has(id))

function onEnter(): void {
  shouldLoadTracks.value = true // précharge les lecteurs dès le survol
  if (!isOpen.value) emit('focusImage', props.imgUrls[0])
}

function onLeave(): void {
  if (!isOpen.value) emit('focusImage', undefined)
}

function openDialog(): void {
  shouldLoadTracks.value = true
  isOpen.value = true
}

const { copy } = useCopy()
</script>

<template>
  <!-- Carte -->
  <article
    v-bind="$attrs"
    class="group relative aspect-square overflow-hidden rounded-[5px] bg-bg text-fg"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <img
      :src="imgUrls[0]"
      :alt="name"
      class="absolute inset-0 size-full object-cover grayscale-80 transition-[scale,filter] duration-300 ease-in-out group-hover:scale-140 group-hover:grayscale-0 pointer-coarse:grayscale-30"
    />

    <div class="relative flex flex-col p-2">
      <h2 class="text-[4rem] leading-tight max-[550px]:text-5xl">{{ name }}</h2>
      <ul class="flex flex-wrap">
        <li
          v-for="style in styles"
          :key="style"
          class="m-1 rounded-[5px] bg-bg/70 p-2 font-bold transition-colors duration-100 hover:bg-bg"
        >
          {{ style }}
        </li>
      </ul>
    </div>

    <span
      aria-hidden="true"
      class="absolute top-[55%] left-1/2 w-40 -translate-1/2 rounded-[5px] bg-white/80 p-3 text-center text-2xl text-fg-inverse opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      Show
    </span>

    <!-- Bouton invisible sur toute la carte : clic, clavier et lecteurs d'écran -->
    <button
      type="button"
      :aria-label="`Voir la fiche de ${name}`"
      class="absolute inset-0 cursor-pointer rounded-[5px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg"
      @click="openDialog"
    />
  </article>

  <!-- Fiche détaillée -->
  <DialogItem
    v-model:open="isOpen"
    class="[scrollbar-thin] [scrollbar-color:white_var(--color-bg)] bg-bg text-fg backdrop:backdrop-blur-[5px]"
    @close="emit('focusImage', undefined)"
  >
    <div class="flex flex-col">
      <div class="flex h-56 flex-col justify-between border-b-2 border-fg p-4">
        <div>
          <h2 class="text-[4rem] leading-tight max-[550px]:text-[2rem]">{{ name }}</h2>
          <ul class="flex flex-wrap items-end">
            <li
              v-for="style in styles"
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
              v-if="network?.insta"
              :href="network.insta"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Instagram de ${name}`"
              class="text-white/70 transition-colors hover:text-white"
            >
              <Icon name="simple-icons:instagram" class="size-8" />
            </a>
            <a
              v-if="network?.soundCloud"
              :href="network.soundCloud"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`SoundCloud de ${name}`"
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
          v-for="url in imgUrls"
          :key="url"
          :src="url"
          :alt="name"
          class="size-full min-w-0 flex-1 object-cover"
          :style="{ objectPosition: `50% ${imageCenter}%` }"
        />
      </div>

      <div class="flex min-h-75 flex-wrap justify-center border-t-2 border-fg bg-black/40 p-2">
        <template v-if="shouldLoadTracks">
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
        </template>

        <section class="min-w-[min(300px,100%)] grow p-2">
          <h3 class="text-5xl">Bio</h3>
          <div class="flex max-w-100 flex-col justify-center">
            <p v-for="(line, i) in description" :key="i">{{ line }}</p>
          </div>
        </section>
      </div>
    </div>
  </DialogItem>
</template>
