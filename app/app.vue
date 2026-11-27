<script setup lang="ts">
import { DEFAULT_BG, useBgColors } from '~/composables/useBgColors'
import { useTemplateRef } from 'vue'

const IS_BG_ANIMATED = true

const { y } = useWindowScroll()

const route = useRoute()
const isHome = computed(() => route.path === '/')

const bg = useBgColors()
const bgColors = computed(() => toBgColors(bg.value))
// La fiche artiste choisit ses couleurs ; toutes les autres pages reviennent au défaut
watch(
  () => route.name,
  (name) => {
    if (name !== 'artistes-slug') {
      bg.value = DEFAULT_BG
    }
  },
)

const nav = useTemplateRef<HTMLElement>('nav')
useGsap(({ gsap }) => {
  const navEl = nav.value
  if (!navEl) return

  gsap.fromTo(
    navEl.children,
    { autoAlpha: 0, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.6, stagger: 0.1 },
  )
})

const { copy } = useCopy()
const linkClass = 'text-[3.5vw] text-white/70 transition-colors hover:text-white px-6'
const footerIconClass = 'cursor-pointer transition-transform duration-75 hover:scale-120'
</script>

<template>
  <UApp>
    <div>
      <nav
        ref="nav"
        data-anim="hero"
        aria-label="Navigation principale"
        class="fixed left-1/2 z-100 flex max-w-full min-w-100 -translate-1/2 transform items-end justify-between px-8 py-4 transition delay-100 ease-in-out"
        :class="isHome ? 'top-[65%]' : 'top-[5%]'"
        :style="y !== 0 ? 'transform: translateY(-200px)' : ''"
      >
        <LeftRightAnimated>
          <NuxtLink to="/" :class="linkClass">KRAM</NuxtLink>
        </LeftRightAnimated>
        <LeftRightAnimated>
          <NuxtLink to="/artistes" :class="linkClass">ARTISTES</NuxtLink>
        </LeftRightAnimated>
        <LeftRightAnimated>
          <NuxtLink to="/evenements" :class="linkClass">EVENTS</NuxtLink>
        </LeftRightAnimated>
      </nav>

      <!-- Décor commun : fond animé + titre (les pages ont leur propre h1) -->
      <div aria-hidden="true" class="fixed inset-0 z-0 overflow-hidden bg-bg">
        <AnimatedBg :animated="IS_BG_ANIMATED" :bg-colors="bgColors" class="absolute inset-0" />
      </div>

      <NuxtPage />

      <footer class="group fixed bottom-0 left-1/2 z-100 h-10 w-60 -translate-x-1/2">
        <div
          class="flex h-full items-center justify-around rounded-t-[5px] bg-white text-fg-inverse"
        >
          <a
            href="https://www.instagram.com/krambzh/"
            target="_blank"
            aria-label="Instagram de KRAM"
            class="h-3.5"
            :class="footerIconClass"
          >
            <Icon name="simple-icons:instagram" class="flex size-5!" />
          </a>
          <a
            href="https://soundcloud.com/krambzh"
            target="_blank"
            aria-label="SoundCloud de KRAM"
            class="h-5"
            :class="footerIconClass"
          >
            <Icon name="simple-icons:soundcloud" class="flex size-5!" />
          </a>
          <button
            type="button"
            aria-label="Copier l'adresse email de booking"
            class="h-5"
            :class="footerIconClass"
            @click="copy(BOOKING_EMAIL)"
          >
            <Icon name="lucide:mail" class="flex size-5!" />
          </button>
        </div>
      </footer>
      ->
    </div>
  </UApp>
</template>
