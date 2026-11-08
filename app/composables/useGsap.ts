import type { Ref } from 'vue'

type Gsap = (typeof import('gsap'))['gsap']
type SplitTextStatic = (typeof import('gsap/SplitText'))['SplitText']

export interface GsapTools {
  gsap: Gsap
  SplitText: SplitTextStatic
}

/**
 * Charge GSAP + SplitText côté client, uniquement là où c'est utilisé.
 * - Rien ne s'exécute si le visiteur préfère moins d'animations.
 * - `setup` peut renvoyer une fonction de nettoyage (écouteurs, etc.).
 * - Tout est annulé au démontage du composant.
 */
export function useGsap(
  setup: (tools: GsapTools) => undefined | (() => void),
  scope?: Readonly<Ref<HTMLElement | null>>,
) {
  let mm: ReturnType<Gsap['matchMedia']> | undefined
  let disposed = false

  onMounted(async () => {
    const [{ gsap }, { SplitText }] = await Promise.all([import('gsap'), import('gsap/SplitText')])
    if (disposed) return

    gsap.registerPlugin(SplitText)
    mm = gsap.matchMedia(scope?.value ?? undefined)
    mm.add('(prefers-reduced-motion: no-preference)', () => setup({ gsap, SplitText }))
  })

  onBeforeUnmount(() => {
    disposed = true
    mm?.revert()
  })
}
