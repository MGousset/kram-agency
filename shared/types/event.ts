export interface EventVideo {
  url: string // mp4 sur R2
  poster?: string // image affichée avant la lecture
}

export interface EventSummary {
  slug: string
  name: string
  date: string
  location: string
  styles: string[]
  photos: string[]
  guests: string[]
}

export interface EventDetail extends EventSummary {
  videos: EventVideo[]
}
