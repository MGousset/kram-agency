export interface ArtistVideo {
  title?: string
  url: string // URL YouTube : watch?v=, youtu.be/, shorts/, embed/, live/
  thumbnail?: string // URL de la miniature (optionnelle : fallback automatique YouTube)
}

/** URL à mettre dans l'iframe (youtube-nocookie = meilleur pour le RGPD) */
export function getYoutubeEmbedUrl(id: string, autoplay = false): string {
  const params = new URLSearchParams({ rel: '0' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

/** Miniature fournie par YouTube (utilisée si aucune miniature n'est stockée) */
export function getYoutubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
