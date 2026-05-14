CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`transactionDate` integer NOT NULL
);
