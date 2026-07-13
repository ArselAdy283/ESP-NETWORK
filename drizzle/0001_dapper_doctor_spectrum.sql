RENAME TABLE `account` TO `web_account`;--> statement-breakpoint
RENAME TABLE `session` TO `web_session`;--> statement-breakpoint
RENAME TABLE `user` TO `web_user`;--> statement-breakpoint
RENAME TABLE `verification` TO `web_verification`;--> statement-breakpoint
ALTER TABLE `web_session` DROP INDEX `session_token_unique`;--> statement-breakpoint
ALTER TABLE `web_user` DROP INDEX `user_email_unique`;--> statement-breakpoint
ALTER TABLE `web_account` DROP FOREIGN KEY `account_userId_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `web_session` DROP FOREIGN KEY `session_userId_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `web_account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `web_session` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `web_user` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `web_verification` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `web_account` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `web_session` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `web_user` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `web_verification` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `web_session` ADD CONSTRAINT `web_session_token_unique` UNIQUE(`token`);--> statement-breakpoint
ALTER TABLE `web_user` ADD CONSTRAINT `web_user_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `web_account` ADD CONSTRAINT `web_account_userId_web_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `web_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `web_session` ADD CONSTRAINT `web_session_userId_web_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `web_user`(`id`) ON DELETE no action ON UPDATE no action;