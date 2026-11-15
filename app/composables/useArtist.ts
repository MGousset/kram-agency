export const useArtists = (opts: { server?: boolean; lazy?: boolean } = {}) =>
  useFetch('/api/artists/', {
    key: 'artists',
    default: () => [],
    // Réutilise les données déjà chargées au lieu de rappeler l'API
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
    ...opts,
  })
