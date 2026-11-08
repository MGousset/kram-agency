<script setup lang="ts">
import { artistes, BOOKING_EMAIL, colorByImageUrl, defaultBgColors } from '~/data/artists'

const IS_BG_ANIMATED = true // passe à false pendant le dev pour ménager le GPU

/** Couleurs du fond selon l'artiste survolé */
const bgColors = shallowRef(defaultBgColors)
function changeBgColors(imgUrl?: string): void {
  bgColors.value = (imgUrl && colorByImageUrl.get(imgUrl)) || defaultBgColors
}

/** Navigation entre les deux écrans (le défilement libre est bloqué) */
const artistsSection = useTemplateRef<HTMLElement>('artists')
const isAtTop = ref(true)
const reducedMotion = usePreferredReducedMotion()

function scrollToSection(section: 'top' | 'artists', smooth = true): void {
  isAtTop.value = section === 'top'
  const top = isAtTop.value ? 0 : (artistsSection.value?.offsetTop ?? window.innerHeight)
  const behavior = smooth && reducedMotion.value !== 'reduce' ? 'smooth' : 'auto'
  window.scrollTo({ top, behavior })
}

onMounted(() => window.scrollTo({ top: 0 }))
// Au redimensionnement, on reste sur l'écran affiché
useEventListener('resize', () => scrollToSection(isAtTop.value ? 'top' : 'artists', false))

/** Titre et navbar : apparition, puis lettres qui grossissent au survol */
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
  <nav
    ref="nav"
    data-anim="hero"
    aria-label="Navigation principale"
    class="fixed left-1/2 z-100 flex w-[25rem] max-w-full -translate-1/2 items-end justify-between px-8 py-4 transition-[top] duration-350 ease-linear"
    :class="isAtTop ? 'top-[65%]' : 'top-[5%]'"
  >
    <LeftRightAnimated animation="leftRight">
      <a href="#top" :class="linkClass" @click.prevent="scrollToSection('top')">KRAM</a>
    </LeftRightAnimated>
    <LeftRightAnimated animation="rightLeft">
      <a href="#artists" :class="linkClass" @click.prevent="scrollToSection('artists')">ARTISTES</a>
    </LeftRightAnimated>
  </nav>

  <header id="top" class="sticky top-0 z-0 h-dvh overflow-hidden bg-bg">
    <AnimatedBg :animated="IS_BG_ANIMATED" :bg-colors="bgColors" class="absolute inset-0" />
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-black/20" />

    <div
      data-anim="hero"
      class="absolute inset-x-0 flex -translate-y-1/2 justify-center px-4 transition-[top] duration-350 ease-linear"
      :class="isAtTop ? 'top-1/2' : '-top-[10%]'"
    >
      <h1
        ref="title"
        class="text-[9vw] leading-none tracking-wide whitespace-pre text-fg select-none"
      >
        KRAM AGENCY
      </h1>
    </div>
  </header>

  <main id="artists" ref="artists" class="relative z-1 w-full overflow-x-hidden">
    <section
      aria-labelledby="artists-title"
      class="flex h-dvh flex-col items-center bg-black/10 pb-12"
    >
      <h2 id="artists-title" class="flex h-36 shrink-0 items-end justify-center text-fg">
        ARTISTES
      </h2>

      <div
        class="min-h-0 w-full flex-1 [scrollbar-width:thin] [scrollbar-color:white_transparent] overflow-y-auto px-4 py-2.5"
      >
        <!-- Remplace centerArtistItems() : cartes de 250 à 450 px, centrées -->
        <div
          class="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),450px))] justify-center gap-4"
        >
          <ArtistItem
            v-for="artist in artistes"
            :key="artist.name"
            v-bind="artist"
            @focus-image="changeBgColors"
          />
        </div>
      </div>
    </section>
  </main>

  <footer class="group fixed bottom-0 left-1/2 z-100 h-10 w-[250px] -translate-x-1/2">
    <div
      class="relative top-1/2 flex h-full items-center justify-around rounded-t-[10px] bg-white/70 text-fg-inverse transition-[top,background-color] duration-100 ease-in-out group-focus-within:top-0 group-focus-within:bg-white group-hover:top-0 group-hover:bg-white"
    >
      <a
        href="https://www.instagram.com/krambzh/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de KRAM"
        :class="footerIconClass"
      >
        <Icon name="simple-icons:instagram" class="size-6" />
      </a>
      <a
        href="https://soundcloud.com/krambzh"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SoundCloud de KRAM"
        :class="footerIconClass"
      >
        <Icon name="simple-icons:soundcloud" class="size-6" />
      </a>
      <button
        type="button"
        aria-label="Copier l'adresse email de booking"
        :class="footerIconClass"
        @click="copy(BOOKING_EMAIL)"
      >
        <Icon name="lucide:mail" class="size-6" />
      </button>
    </div>
  </footer>
</template>
