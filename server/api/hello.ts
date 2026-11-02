export default defineEventHandler(() => ({
  message: 'Hello depuis un Cloudflare Worker 👋',
  time: new Date().toISOString(),
}))
