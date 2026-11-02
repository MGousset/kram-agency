<script setup lang="ts">
const root = ref<HTMLElement | null>(null)

useGsap(({ gsap }) => {
  // fromTo : le CSS cache le hero au départ, on le rend visible ici
  gsap.fromTo(
    '[data-anim="hero"] > *',
    { y: 40, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
  )

  gsap.utils.toArray<HTMLElement>('[data-anim="card"]').forEach((card) => {
    gsap.from(card, {
      y: 60,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
    })
  })
}, root)

// Page prérendue : on appelle l'API côté client pour voir le Worker répondre en live
const { data } = useFetch('/api/hello', { server: false, lazy: true })
</script>

<template>
  <main ref="root" class="min-h-screen bg-zinc-950 font-sans text-zinc-100">
    <section
      data-anim="hero"
      class="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <h1 class="text-5xl font-bold tracking-tight md:text-7xl">
        Nuxt <span class="text-brand-500">×</span> Tailwind
        <span class="text-brand-500">×</span> GSAP
      </h1>
      <p class="text-lg text-zinc-400">Prérendu et servi par Cloudflare Workers.</p>
      <p class="font-mono text-sm text-zinc-500">API : {{ data?.message ?? '…' }}</p>
    </section>

    <section class="mx-auto grid max-w-5xl gap-6 px-6 pb-32 md:grid-cols-3">
      <article
        v-for="n in 6"
        :key="n"
        data-anim="card"
        class="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h2 class="mb-2 text-xl font-semibold">Card {{ n }}</h2>
        <p class="text-zinc-400">Animée au scroll avec ScrollTrigger.</p>
      </article>
    </section>
  </main>
</template>
