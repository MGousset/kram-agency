<script setup lang="ts">
import * as THREE from 'three'
import { gsap } from 'gsap'
import type { BgColors } from '~/data/artists'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: BgColors
}>()

const emit = defineEmits<{ ready: [] }>()

const TIME_SPEED = 0.012 // par seconde, même vitesse qu'avant à 60 fps
const COLOR_DURATION = 0.8 // fondu entre les couleurs, en secondes
const MAX_PIXEL_RATIO = 2

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const { width, height } = useWindowSize()
const { pixelRatio } = useDevicePixelRatio()

/** Scène plein écran : plan 2×2 vu par une caméra orthographique de -1 à 1 */
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
camera.position.z = 1
const geometry = new THREE.PlaneGeometry(2, 2)

const uniforms = {
  u_time: { value: 0 },
  u_pixelRatio: { value: 1 },
  // clone() : le fondu modifie ces couleurs, pas les données de artists.ts
  u_color1: { value: bgColors.color1.clone() },
  u_color2: { value: bgColors.color2.clone() },
}

const material = new THREE.ShaderMaterial({
  vertexShader: noiseVertex,
  fragmentShader: noiseFragment,
  uniforms,
})
scene.add(new THREE.Mesh(geometry, material))

let renderer: THREE.WebGLRenderer | undefined
const render = () => renderer?.render(scene, camera)

function resize(): void {
  if (!renderer) return
  renderer.setPixelRatio(Math.min(pixelRatio.value, MAX_PIXEL_RATIO))
  renderer.setSize(width.value, height.value, false) // taille affichée gérée en CSS
  uniforms.u_pixelRatio.value = renderer.getPixelRatio()
  render()
}

/** Boucle d'animation à vitesse constante, en pause quand l'onglet est caché */
function tick(_time: number, deltaTime: number): void {
  uniforms.u_time.value += (deltaTime / 1000) * TIME_SPEED
  render()
}

const start = () => gsap.ticker.add(tick)
const stop = () => gsap.ticker.remove(tick)

/** Fondu des couleurs au survol d'un artiste */
function tweenColor(target: THREE.Color, to: THREE.Color): void {
  gsap.to(target, {
    r: to.r,
    g: to.g,
    b: to.b,
    duration: COLOR_DURATION,
    ease: 'power2.out',
    overwrite: true,
    onUpdate: () => {
      if (!animated) render() // sans la boucle, on redessine nous-mêmes
    },
  })
}

watch(
  () => bgColors,
  (colors) => {
    tweenColor(uniforms.u_color1.value, colors.color1)
    tweenColor(uniforms.u_color2.value, colors.color2)
  },
)

watch([width, height, pixelRatio], resize)
watch(
  () => animated,
  (isAnimated) => (isAnimated ? start() : stop()),
)

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value! })
  resize()
  emit('ready')
  if (animated) start()
})

onBeforeUnmount(() => {
  stop()
  gsap.killTweensOf([uniforms.u_color1.value, uniforms.u_color2.value])
  geometry.dispose()
  material.dispose()
  renderer?.dispose()
  renderer?.forceContextLoss() // libère le contexte WebGL tout de suite
})
</script>

<template>
  <canvas ref="canvas" class="block" />
</template>
