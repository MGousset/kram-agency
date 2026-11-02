import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  devtools: { enabled: true },

  // Tester les comportements de Nuxt 5 (à activer sur une branche dédiée)
  // future: { compatibilityVersion: 5 },

  modules: ['@nuxt/eslint', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Polices téléchargées au build et servies depuis ton domaine
  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 600, 700] }],
  },

  routeRules: {
    // HTML statique généré au build, servi directement par les assets Cloudflare
    '/': { prerender: true },
    // Cache Nitro (mémoire de l'instance Worker) pendant 60 s
    '/api/**': { cache: { maxAge: 60 } },
  },

  // Build pour Cloudflare Workers (Workers + Static Assets)
  nitro: {
    preset: 'cloudflare_module',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'kram-agency',
    },
  },
})
