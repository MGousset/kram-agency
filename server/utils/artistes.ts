import type { schema } from '@nuxthub/db'
import type { ArtistEntry } from '#shared/types/artist'
import { toSlug } from '#shared/utils/slug'

type ArtistRow = typeof schema.artists.$inferSelect

export const toEntry = (r: ArtistRow): ArtistEntry => ({
  slug: toSlug(r.name),
  artist: {
    name: r.name,
    description: r.description,
    imgUrls: r.imgUrls,
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
