CREATE TABLE `event_artists` (
	`eventId` integer NOT NULL,
	`artistId` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artistId`) REFERENCES `artists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`date` text NOT NULL,
	`location` text NOT NULL,
	`styles` text DEFAULT '[]' NOT NULL,
	`photos` text DEFAULT '[]' NOT NULL,
	`videos` text DEFAULT '[]' NOT NULL,
	`guests` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);