import type { Ref } from 'vue'

type Gsap = (typeof import('gsap'))['gsap']
type ScrollTriggerStatic = (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

export interface GsapTools {
  gsap: Gsap
  ScrollTrigger: ScrollTriggerStatic
}

/**
 * Charge GSAP + ScrollTrigger côté client, uniquement sur les pages qui l'utilisent.
 * - Animations désactivées si l'utilisateur préfère moins d'animations.
 * - Nettoyage automatique (tweens, ScrollTriggers) au démontage.
 */
export function useGsap(setup: (tools: GsapTools) => void, scope?: Ref<HTMLElement | null>) {
  let mm: ReturnType<Gsap['matchMedia']> | undefined
  let disposed = false

  onMounted(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    if (disposed) return

    gsap.registerPlugin(ScrollTrigger)
    mm = gsap.matchMedia(scope?.value ?? undefined)
    mm.add('(prefers-reduced-motion: no-preference)', () => setup({ gsap, ScrollTrigger }))
  })

  onBeforeUnmount(() => {
    disposed = true
    mm?.revert()
  })
}
