import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Rgb } from '#shared/types/artist'

export const artists = sqliteTable('artists', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text({ mode: 'json' }).$type<string[]>().notNull(),
  imgUrls: text({ mode: 'json' }).$type<string[]>().notNull(),
  videoIds: text({ mode: 'json' }).$type<string[]>().notNull().default([]),
  styles: text({ mode: 'json' }).$type<string[]>().notNull(),
  imageCenter: integer().notNull().default(50),
  bgColor1: text({ mode: 'json' }).$type<Rgb>().notNull(),
  bgColor2: text({ mode: 'json' }).$type<Rgb>().notNull(),
  trackPlaylistId: text().$type<string>(),
  prodPlaylistId: text().$type<string>(),
  insta: text(),
  soundCloud: text(),
  youtube: text(),
  twitch: text(),
  linktree: text(),
})
