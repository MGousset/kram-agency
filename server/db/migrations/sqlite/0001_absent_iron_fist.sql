PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`imgUrls` text NOT NULL,
	`styles` text NOT NULL,
	`imageCenter` integer DEFAULT 50 NOT NULL,
	`bgColor1` text NOT NULL,
	`bgColor2` text NOT NULL,
	`trackPlaylistId` text,
	`prodPlaylistId` text,
	`insta` text,
	`soundCloud` text
);
--> statement-breakpoint
INSERT INTO `__new_artists`("id", "name", "description", "imgUrls", "styles", "imageCenter", "bgColor1", "bgColor2", "trackPlaylistId", "prodPlaylistId", "insta", "soundCloud") SELECT "id", "name", "description", "imgUrls", "styles", "imageCenter", "bgColor1", "bgColor2", "trackPlaylistId", "prodPlaylistId", "insta", "soundCloud" FROM `artists`;--> statement-breakpoint
DROP TABLE `artists`;--> statement-breakpoint
ALTER TABLE `__new_artists` RENAME TO `artists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;