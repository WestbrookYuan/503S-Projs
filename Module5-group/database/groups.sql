CREATE TABLE `groups` (
  `group_id` mediumint(5) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(1024) NOT NULL,
  `group_users` varchar(1024) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB