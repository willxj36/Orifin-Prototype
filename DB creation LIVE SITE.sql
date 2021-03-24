CREATE SCHEMA `heroku_cd251d92365ee12`;

USE `heroku_cd251d92365ee12`;

CREATE TABLE users (
	`id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(64) NOT NULL,
    `lastName` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `roleid` INT NOT NULL DEFAULT '1',
    `_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

ALTER TABLE users
    ADD CONSTRAINT `fk_role`
    FOREIGN KEY (`roleid`)
    REFERENCES `roles` (`id`)
;

CREATE TABLE roles (
	`id` INT NOT NULL,
    `role` VARCHAR(25) NOT NULL,
    `price` DECIMAL(4,2) NOT NULL DEFAULT '0.00',
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

CREATE TABLE permissions (
	`id` INT NOT NULL AUTO_INCREMENT,
    `permission` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE rolePermissions (
	`roleid` INT NOT NULL,
    `permissionid` INT NOT NULL,
    PRIMARY KEY (`roleid`, `permissionid`),
    CONSTRAINT `fk_roleid`
    FOREIGN KEY (`roleid`)
    REFERENCES `roles` (`id`),
    CONSTRAINT `fk_permissionid`
    FOREIGN KEY (`permissionid`)
    REFERENCES `permissions` (`id`)
);