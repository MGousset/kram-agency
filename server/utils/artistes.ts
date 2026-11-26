import type { schema } from '@nuxthub/db'
import type { ArtistEntry } from '#shared/types/artist'
import { toSlug } from '#shared/utils/slug'
import type { EventDetail, EventSummary } from '#shared/types/event'

type ArtistRow = typeof schema.artists.$inferSelect
type EventRow = typeof schema.events.$inferSelect

export const toEntry = (r: ArtistRow): ArtistEntry => ({
  slug: toSlug(r.name),
  artist: {
    name: r.name,
    description: r.description,
    imgUrls: r.imgUrls,
    videoIds: r.videoIds,
    styles: r.styles,
    trackPlaylistId: r.trackPlaylistId ?? undefined,
    prodPlaylistId: r.prodPlaylistId ?? undefined,
    imageCenter: r.imageCenter,
    network: {
      insta: r.insta ?? undefined,
      soundCloud: r.soundCloud ?? undefined,
      youtube: r.youtube ?? undefined,
      twitch: r.twitch ?? undefined,
      linktree: r.linktree ?? undefined,
    },
  },
  bgColors: { color1: r.bgColor1, color2: r.bgColor2 },
})

export const toEventSummary = (r: EventRow): EventSummary => ({
  slug: r.slug,
  name: r.name,
  date: r.date,
  location: r.location,
  styles: r.styles,
  photos: r.photos.slice(0, 4),
  guests: r.guests,
})

export const toEventDetail = (r: EventRow): EventDetail => ({
  ...toEventSummary(r),
  photos: r.photos, // toutes les photos sur la page détail
  videos: r.videos,
})
