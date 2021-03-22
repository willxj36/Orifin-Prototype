CREATE SCHEMA orifin;

USE orifin;

CREATE TABLE users (
	`id` INT NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(64) NOT NULL,
    `lastname` VARCHAR(64) NOT NULL,
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

INSERT INTO roles SET id = 2, role = 'test membership';