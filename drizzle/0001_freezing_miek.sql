CREATE TABLE `admin_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminPassword` varchar(255) NOT NULL,
	`adBannerText` text,
	`adBannerLink` varchar(500),
	`mindBlockLink` varchar(500),
	`musicGameLink` varchar(500),
	`pageNameChat` varchar(100) DEFAULT '대화',
	`pageNameCalendar` varchar(100) DEFAULT '달력',
	`pageNameCommunity` varchar(100) DEFAULT '커뮤니티',
	`pageNameDex` varchar(100) DEFAULT '도감',
	`pageNameReport` varchar(100) DEFAULT '리포트',
	`pageNameGame` varchar(100) DEFAULT '게임',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collected_cats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`catMood` varchar(50) NOT NULL,
	`collectedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collected_cats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feed_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feed_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_profiles` DROP COLUMN `level`;--> statement-breakpoint
ALTER TABLE `user_profiles` DROP COLUMN `exp`;--> statement-breakpoint
ALTER TABLE `user_profiles` DROP COLUMN `apples`;