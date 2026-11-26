import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Rgb } from '#shared/types/artist'
import type { EventVideo } from '#shared/types/event'

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

export const events = sqliteTable('events', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(),
  name: text().notNull(),
  date: text().notNull(), // 'AAAA-MM-JJ'
  location: text().notNull(),
  styles: text({ mode: 'json' }).$type<string[]>().notNull().default([]),
  photos: text({ mode: 'json' }).$type<string[]>().notNull().default([]),
  videos: text({ mode: 'json' }).$type<EventVideo[]>().notNull().default([]),
  guests: text({ mode: 'json' }).$type<string[]>().notNull().default([]),
})

export const eventArtists = sqliteTable('event_artists', {
  eventId: integer()
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  artistId: integer()
    .notNull()
    .references(() => artists.id, { onDelete: 'cascade' }),
})
