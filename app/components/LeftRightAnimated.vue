<script setup lang="ts">
import type { GsapTools } from '~/composables/useGsap'

const { animated = true } = defineProps<{
  animated?: boolean
}>()

const AMPLITUDE = 8 // px

const el = useTemplateRef<HTMLElement>('el')
let tween: ReturnType<GsapTools['gsap']['fromTo']> | undefined

useGsap(({ gsap }) => {
  const duration = gsap.utils.random(3, 6)

  tween = gsap.fromTo(
    el.value,
    { x: -AMPLITUDE },
    {
      x: AMPLITUDE,
      duration,
      delay: gsap.utils.random(0, duration),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: !animated,
    },
  )

  return () => (tween = undefined)
})

watch(
  () => animated,
  (isAnimated) => (isAnimated ? tween?.play() : tween?.pause()),
)
</script>

<template>
  <span ref="el" class="inline-block">
    <slot />
  </span>
</template>
