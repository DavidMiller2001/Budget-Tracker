CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer,
	`created_at` integer DEFAULT (unixepoch()),
	`updatedAt` integer
);
