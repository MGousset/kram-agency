<script setup lang="ts">
import type { BgColors } from '~/utils/bgColors'
import fixedBgUrl from '~/assets/img/fixedBg.jpg'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: BgColors
}>()

const reducedMotion = usePreferredReducedMotion()

const isSceneReady = ref(false)
</script>

<template>
  <div class="-z-11 overflow-hidden bg-bg">
    <ClientOnly>
      <LazyAnimatedBgScene
        class="absolute inset-0 size-full"
        :bg-colors="bgColors"
        :animated="animated && reducedMotion !== 'reduce'"
        @ready="isSceneReady = true"
      />
    </ClientOnly>
  </div>
</template>
