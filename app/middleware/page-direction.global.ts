// app/middleware/page-direction.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server || to.path === from.path) return

  const depth = (p: string) => p.split('/').filter(Boolean).length
  const d = depth(to.path) - depth(from.path)
  const name = d > 0 ? 'scroll-down' : d < 0 ? 'scroll-up' : 'fade'

  to.meta.pageTransition = { name, mode: 'out-in' }
  from.meta.pageTransition = { name, mode: 'out-in' }
})
