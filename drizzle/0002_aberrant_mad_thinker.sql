ALTER TABLE `web_user` ADD `javaUsername` varchar(255);--> statement-breakpoint
ALTER TABLE `web_user` ADD `bedrockUsername` varchar(255);--> statement-breakpoint
ALTER TABLE `web_user` ADD `javaTextureId` text;--> statement-breakpoint
ALTER TABLE `web_user` ADD `bedrockTextureId` text;--> statement-breakpoint
ALTER TABLE `web_user` ADD CONSTRAINT `web_user_javaUsername_unique` UNIQUE(`javaUsername`);--> statement-breakpoint
ALTER TABLE `web_user` ADD CONSTRAINT `web_user_bedrockUsername_unique` UNIQUE(`bedrockUsername`);