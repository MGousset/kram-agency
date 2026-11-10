<script setup lang="ts">
import type { BgColors } from '~/utils/bgColors'
import fixedBgUrl from '~/assets/img/fixedBg.jpg'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: BgColors
}>()

// Écran tactile ou petit écran : image fixe, Three.js n'est pas téléchargé
const isMobile = useMediaQuery('(pointer: coarse), (max-width: 600px)')
const reducedMotion = usePreferredReducedMotion()

const isSceneReady = ref(false)
</script>

<template>
  <div class="-z-11 overflow-hidden bg-bg">
    <img
      :src="fixedBgUrl"
      alt=""
      class="absolute inset-0 size-full object-cover transition-opacity duration-700"
      :class="{ 'opacity-0': isSceneReady }"
    />

    <ClientOnly>
      <LazyAnimatedBgScene
        v-if="!isMobile"
        class="absolute inset-0 size-full"
        :bg-colors="bgColors"
        :animated="animated && reducedMotion !== 'reduce'"
        @ready="isSceneReady = true"
      />
    </ClientOnly>
  </div>
</template>
