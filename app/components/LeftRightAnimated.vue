<script setup lang="ts">
import type { GsapTools } from '~/composables/useGsap'

const { animated = true, animation } = defineProps<{
  animated?: boolean
  animation: 'leftRight' | 'rightLeft'
}>()

const AMPLITUDE = 12 // px

const el = useTemplateRef<HTMLElement>('el')
let tween: ReturnType<GsapTools['gsap']['fromTo']> | undefined

useGsap(({ gsap }) => {
  const dir = animation === 'leftRight' ? 1 : -1
  const duration = gsap.utils.random(1, 2)

  tween = gsap.fromTo(
    el.value,
    { x: -AMPLITUDE * dir },
    {
      x: AMPLITUDE * dir,
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
