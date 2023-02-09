CREATE TABLE `likesRecord` (
  `user_id` varchar(1024) NOT NULL,
  `story_id` mediumint(5) unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`story_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `likesRecord_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `likesRecord_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`)
) ENGINE=InnoDB