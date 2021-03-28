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
    `price` DECIMAL(3,2) NOT NULL DEFAULT '0.00',
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

CREATE TABLE reservationAvailability (
	`date` DATETIME NOT NULL,
    `public` TINYINT NOT NULL DEFAULT '10',
    `private` TINYINT NOT NULL DEFAULT '1',
    `team` TINYINT NOT NULL DEFAULT '1',
    `vr` TINYINT NOT NULL DEFAULT '5',
    `fullTournament` TINYINT NOT NULL DEFAULT '1',
    PRIMARY KEY (`date`)
);

CREATE TABLE reservations (
	`id` INT NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME NOT NULL,
    `endTime` DATETIME NOT NULL,
    `userid` INT NOT NULL,
    `type` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE monitors (
	`id` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE headsets (
	`id` INT NOT NULL PRIMARY KEY
);

ALTER TABLE reservations
	ADD COLUMN `monitorid` INT NULL,
    ADD COLUMN `headsetid` INT NULL,
    ADD CONSTRAINT `fk_monitorid`
		FOREIGN KEY (`monitorid`)
        REFERENCES `monitors` (`id`),
	ADD CONSTRAINT `fk_headsetid`
		FOREIGN KEY (`headsetid`)
        REFERENCES `headsets` (`id`)
	;