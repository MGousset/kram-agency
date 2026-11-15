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
    trackIds: r.trackIds,
    prodIds: r.prodIds,
    imageCenter: r.imageCenter,
    network: { insta: r.insta ?? undefined, soundCloud: r.soundCloud ?? undefined },
  },
  bgColors: { color1: r.bgColor1, color2: r.bgColor2 },
})
