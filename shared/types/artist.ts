export type Rgb = [number, number, number] // 0-255, le shader divise par 255

export interface Artist {
  name: string
  description: string[]
  imgUrls: string[]
  styles: string[]
  trackIds: string[]
  prodIds: string[]
  imageCenter: number
  network?: { insta?: string; soundCloud?: string }
}

/** Réponse de l'API : les couleurs restent à part pour ne pas finir en attributs HTML */
export interface ArtistEntry {
  artist: Artist
  bgColors: { color1: Rgb; color2: Rgb }
}
