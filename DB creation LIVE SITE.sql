CREATE SCHEMA `heroku_cd251d92365ee12`;

USE `heroku_cd251d92365ee12`;

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

CREATE TABLE employees (
	`id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(64) NOT NULL,
    `lastName` VARCHAR(64) NOT NULL,
	`username` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `roleid` INT NOT NULL DEFAULT 80,
    `_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_emp_role`
    FOREIGN KEY (`roleid`)
    REFERENCES `roles` (`id`)
);

CREATE TABLE users (
	`id` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(64) NOT NULL,
    `lastName` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `roleid` INT NOT NULL DEFAULT '1',
    `_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `membershipStart` DATETIME NULL,
    `hours` INT NOT NULL DEFAULT 0,
    `hoursNext` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_role`
    FOREIGN KEY (`roleid`)
    REFERENCES `roles` (`id`)
);

CREATE TABLE reservationAvailability (
	`date` DATETIME NOT NULL,
    `public` INT NOT NULL DEFAULT '240',
    `private` INT NOT NULL DEFAULT '120',
    `team` TINYINT NOT NULL DEFAULT '24',
    `vr` TINYINT NOT NULL DEFAULT '24',
    `fullTournament` TINYINT NOT NULL DEFAULT '1',
    PRIMARY KEY (`date`)
);

CREATE TABLE reservations (
	`id` INT NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME NOT NULL,
    `endTime` DATETIME NOT NULL,
    `userid` INT NOT NULL,
    `type` VARCHAR(24) NOT NULL,
    `monitorid` INT NULL,
    `headsetid` INT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_monitorid`
    FOREIGN KEY (`monitorid`)
    REFERENCES monitors (`id`),
    CONSTRAINT `fk_headsetid`
    FOREIGN KEY (`headsetid`)
    REFERENCES headsets (`id`)
);

CREATE TABLE monitors (
	`id` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE headsets (
	`id` INT NOT NULL PRIMARY KEY
);