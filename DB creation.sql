CREATE SCHEMA orifin;

USE orifin;

CREATE USER
	'orifinapp'@'localhost'
IDENTIFIED BY 'password123';

GRANT ALL ON orifin.* TO 'orifinapp'@'localhost';

ALTER USER 'orifinapp'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password123';

CREATE TABLE users (
	`id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(64) NOT NULL,
    `lastName` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `roleid` INT NOT NULL DEFAULT '1',
    `_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_role`
    FOREIGN KEY (`roleid`)
    REFERENCES `roles` (`id`)
);

CREATE TABLE roles (
	`id` INT NOT NULL,
    `role` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE accesstokens (
	`id` INT NOT NULL AUTO_INCREMENT,
    `userid` INT NULL,
    `token` TEXT NULL,
    `_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
    CONSTRAINT `fk_userid`
    FOREIGN KEY (`userid`)
    REFERENCES `users` (`id`)
);