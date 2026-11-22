import { db, schema } from '@nuxthub/db'
import { toSlug } from '#shared/utils/slug'
import { toEntry } from '~~/server/utils/artistes'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  // Le slug n'est pas en base : avec trois artistes, filtrer en JS ne coûte rien
  const rows = await db.select().from(schema.artists)
  const row = rows.find((r) => toSlug(r.name) === slug)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Artiste introuvable' })
  return toEntry(row)
})
