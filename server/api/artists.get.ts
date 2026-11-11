import { asc } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArtistEntry } from '#shared/types/artist'

export default defineEventHandler(async (): Promise<ArtistEntry[]> => {
  const rows = await db.select().from(schema.artists).orderBy(asc(schema.artists.name))
  return rows.map((r) => ({
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
  }))
})
