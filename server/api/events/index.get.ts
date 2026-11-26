import { desc } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { toEventSummary } from '~~/server/utils/artistes'

export default defineEventHandler(async () => {
  const rows = await db.select().from(schema.events).orderBy(desc(schema.events.date))
  return rows.map((r) => toEventSummary(r))
})
