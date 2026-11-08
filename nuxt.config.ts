import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 700] }],
  },

  // Icônes intégrées au bundle : aucune requête au chargement de la page
  icon: {
    clientBundle: { scan: true },
  },

  routeRules: {
    '/': { prerender: true },
  },

  nitro: {
    preset: 'cloudflare_module',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Kram Agency',
      meta: [{ name: 'description', content: 'KRAM, collectif et agence de DJs basé à Brest.' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
})
