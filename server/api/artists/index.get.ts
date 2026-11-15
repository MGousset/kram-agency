import { asc } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArtistEntry } from '#shared/types/artist'
import { toEntry } from '~~/server/utils/artistes'

export default defineEventHandler(async (): Promise<ArtistEntry[]> => {
  const rows = await db.select().from(schema.artists).orderBy(asc(schema.artists.name))
  return rows.map((r) => toEntry(r))
})
