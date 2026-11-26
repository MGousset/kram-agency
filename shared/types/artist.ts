export type Rgb = [number, number, number] // 0-255, le shader divise par 255

export interface Artist {
  name: string
  description: string[]
  imgUrls: string[]
  videoIds: string[]
  styles: string[]
  imageCenter: number
  trackPlaylistId?: string
  prodPlaylistId?: string
  network?: {
    insta?: string
    soundCloud?: string
    youtube?: string
    twitch?: string
    linktree?: string
  }
}

/** Réponse de l'API : les couleurs restent à part pour ne pas finir en attributs HTML */
export interface ArtistEntry {
  slug: string
  artist: Artist
  bgColors: { color1: Rgb; color2: Rgb }
}
