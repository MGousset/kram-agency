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

const title = useTemplateRef<HTMLElement>('title')
const nav = useTemplateRef<HTMLElement>('nav')
useGsap(({ gsap, SplitText }) => {
  const titleEl = title.value
  const navEl = nav.value
  if (!titleEl || !navEl) return

  gsap.set(titleEl, { autoAlpha: 1 }) // annule le masquage CSS de data-anim="hero"

  const split = SplitText.create(titleEl, {
    type: 'chars',
    charsClass: 'char',
    autoSplit: true, // redécoupe après le chargement de la police
    onSplit: (self) =>
      gsap.from(self.chars, {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.04,
      }),
  })

  gsap.fromTo(
    navEl.children,
    { autoAlpha: 0, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.6, stagger: 0.1 },
  )

  // Délégation : fonctionne même après un nouveau découpage
  const onPointerOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const char = (e.target as HTMLElement).closest<HTMLElement>('.char')
    if (!char || gsap.isTweening(char)) return
    gsap
      .timeline()
      .to(char, { scale: 1.2, duration: 0.1, ease: 'power1.out' })
      .to(char, { scale: 1, duration: 0.3, ease: 'power1.inOut' })
  }

  titleEl.addEventListener('pointerover', onPointerOver)
  return () => {
    titleEl.removeEventListener('pointerover', onPointerOver)
    split.revert()
  }
})

const { copy } = useCopy()
const linkClass = 'text-[2rem] text-white/70 transition-colors hover:text-white'
const footerIconClass = 'cursor-pointer transition-transform duration-75 hover:scale-120'
</script>

<template>
  <UApp>
    <div>
      <nav
        ref="nav"
        data-anim="hero"
        aria-label="Navigation principale"
        class="fixed left-1/2 z-100 flex w-[25rem] max-w-full -translate-1/2 transform items-end justify-between px-8 py-4 transition delay-100 ease-in-out"
        :class="isHome ? 'top-[65%]' : 'top-[5%]'"
        :style="y !== 0 ? 'transform: translateY(-200px)' : ''"
      >
        <LeftRightAnimated animation="leftRight">
          <NuxtLink to="/" :class="linkClass">KRAM</NuxtLink>
        </LeftRightAnimated>
        <LeftRightAnimated animation="rightLeft">
          <NuxtLink to="/artistes" :class="linkClass">ARTISTES</NuxtLink>
        </LeftRightAnimated>
      </nav>

      <!-- Décor commun : fond animé + titre (les pages ont leur propre h1) -->
      <div aria-hidden="true" class="fixed inset-0 z-0 overflow-hidden bg-bg">
        <AnimatedBg :animated="IS_BG_ANIMATED" :bg-colors="bgColors" class="absolute inset-0" />
        <div class="pointer-events-none absolute inset-0 bg-black/20" />
        <div
          data-anim="hero"
          class="absolute inset-x-0 flex -translate-y-1/2 justify-center px-4"
          :class="isHome ? 'top-1/2' : 'top-[-10%]'"
        >
          <p
            ref="title"
            class="text-[9vw] leading-none tracking-wide whitespace-pre text-fg select-none"
          >
            KRAM AGENCY
          </p>
        </div>
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
