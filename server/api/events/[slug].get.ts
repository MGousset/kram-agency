import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { toEventDetail } from '~~/server/utils/artistes'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const [row] = await db.select().from(schema.events).where(eq(schema.events.slug, slug)).limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Événement introuvable' })
  return toEventDetail(row)
})
