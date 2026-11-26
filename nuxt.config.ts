export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxthub/core', '@nuxt/ui'],

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      applyMigrationsDuringBuild: false, // pas d'accès à D1 dans la CI
    },
  },

  css: ['~/assets/css/main.css'],

  ui: { colorMode: false },

  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 700] }],
  },

  // Icônes intégrées au bundle : aucune requête au chargement de la page
  icon: {
    clientBundle: { scan: true },
  },

  routeRules: {
    '/': { prerender: true },
    '/artistes': { swr: 300 },
    '/artistes/**': { swr: 300 },
    '/api/**': { swr: 300 },
  },

  nitro: {
    preset: 'cloudflare_module',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr', class: 'light' },
      title: 'Kram Agency',
      meta: [{ name: 'description', content: 'KRAM, collectif et agence de DJs basé à Brest.' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
})
