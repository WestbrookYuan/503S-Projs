CREATE TABLE `events` (
  `event_id` mediumint(5) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(1024) NOT NULL,
  `title` varchar(512) NOT NULL,
  `DATE` date NOT NULL,
  `TIME` time NOT NULL,
  `group_id` mediumint(5) unsigned NOT NULL DEFAULT 1,
  `category` enum('work','daily','other') NOT NULL DEFAULT 'work',
  PRIMARY KEY (`event_id`),
  KEY `group_id` (`group_id`),
  KEY `events_ibfk_2` (`user_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB