<script setup lang="ts">
const props = defineProps<{ videoIds: string[] }>()

const currentId = ref(props.videoIds[0] ?? null)
const autoplay = ref(false) // pas d'autoplay au chargement, seulement au clic

function select(id: string) {
  if (id === currentId.value) return
  autoplay.value = true
  currentId.value = id
}
</script>

<template>
  <div v-if="currentId" class="flex w-full flex-col">
    <!-- Lecteur -->
    <div class="aspect-video w-full overflow-hidden rounded-[5px] bg-black lg:flex-1">
      <iframe
        :key="currentId"
        :src="getYoutubeEmbedUrl(currentId, autoplay)"
        class="size-full"
        title="Lecteur vidéo YouTube"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
      />
    </div>

    <!-- Miniatures : colonne à droite (desktop), défilement horizontal (mobile) -->
    <ul v-if="videoIds.length > 1" class="flex flex-row gap-2 overflow-x-auto overflow-y-hidden">
      <li v-for="(id, i) in videoIds" :key="id">
        <button
          type="button"
          :aria-label="`Lire la vidéo ${i + 1}`"
          :aria-current="id === currentId"
          class="block h-full w-32 overflow-hidden rounded-[5px] ring-2 transition"
          :class="
            id === currentId ? 'ring-primary-500' : 'opacity-70 ring-transparent hover:opacity-100'
          "
          @click="select(id)"
        >
          <img
            :src="getYoutubeThumbnail(id)"
            alt=""
            loading="lazy"
            class="aspect-video h-full object-cover"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
