CREATE TABLE `comments` (
  `id` mediumint(5) unsigned NOT NULL AUTO_INCREMENT,
  `story_id` mediumint(5) unsigned NOT NULL,
  `comment_owner` varchar(1024) NOT NULL,
  `body` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_owner` (`comment_owner`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`comment_owner`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`)
) ENGINE=InnoDB