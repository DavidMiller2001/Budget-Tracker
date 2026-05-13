CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`amount` integer NOT NULL,
	`transactionDate` integer NOT NULL
);
