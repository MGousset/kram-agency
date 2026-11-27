<script setup lang="ts">
import { useArtists } from '~/composables/useArtist'

useSeoMeta({ title: 'Kram Agency' })

const { data: entries } = useArtists({ server: false, lazy: true })

const title = useTemplateRef<HTMLElement>('title')
useGsap(({ gsap, SplitText }) => {
  const titleEl = title.value
  if (!titleEl) return

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

// Une fois la liste reçue, on demande les photos au navigateur
watch(entries, (list) => {
  for (const { artist } of list) {
    const imgUrl = artist.imgUrls[0]

    if (imgUrl) {
      new Image().src = imgUrl
    }
  }
})
</script>

<template>
  <main
    data-anim="hero"
    class="absolute inset-x-0 top-1/2 z-1 flex -translate-y-1/2 justify-center px-4"
  >
    <h1
      ref="title"
      class="text-[9vw] leading-none tracking-wide whitespace-pre text-fg select-none"
    >
      KRAM AGENCY
    </h1>
  </main>
</template>
