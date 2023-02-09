CREATE TABLE `stories` (
  `story_id` mediumint(5) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(1024) NOT NULL,
  `title` varchar(512) NOT NULL,
  `body` varchar(1536) NOT NULL,
  `link` varchar(1024),
  PRIMARY KEY (`story_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB