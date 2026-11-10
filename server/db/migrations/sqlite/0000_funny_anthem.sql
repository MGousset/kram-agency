CREATE TABLE `artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`imgUrls` text NOT NULL,
	`styles` text NOT NULL,
	`trackIds` text NOT NULL,
	`prodIds` text NOT NULL,
	`imageCenter` integer DEFAULT 50 NOT NULL,
	`bgColor1` text NOT NULL,
	`bgColor2` text NOT NULL,
	`insta` text,
	`soundCloud` text
);
