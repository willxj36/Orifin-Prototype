INSERT INTO `roles` SET id = 100, role = 'Webmaster';

ALTER TABLE roles ADD COLUMN `yearPrice` DECIMAL(8,2) NOT NULL DEFAULT '0.00';
ALTER TABLE roles CHANGE COLUMN `price` `monthPrice` DECIMAL(7,2) NOT NULL DEFAULT '0.00';
UPDATE roles SET role = 'Standard', monthprice = '20.00', yearprice = '240.00' WHERE id = 10;
UPDATE roles SET role = 'Silver', monthprice = '600.00', yearprice = '6840.00' WHERE id = 20;
UPDATE roles SET role = 'Gold', monthprice = '1000.00', yearprice = '11400.00' WHERE id = 30;
INSERT INTO roles SET id = 40, role = 'Platinum', monthprice = '2000.00', yearprice = '22800.00';
INSERT INTO roles SET id = 50, role = 'Team', monthprice = '10000.00', yearprice = '114000.00';

SELECT * FROM roles;
SELECT * FROM rolePermissions;
SELECT * FROM permissions;
SELECT * FROM users;
SELECT * FROM reservations;
SELECT * FROM reservationAvailability;
SELECT * FROM monitors;
SELECT * FROM headsets;

SELECT * FROM accesstokens;

INSERT INTO headsets SET id = 8;

UPDATE users SET membershipStart = '2021-03-26 00:00:00' WHERE id = 114;

DELETE FROM users WHERE id >= 14;
DELETE FROM rolepermissions WHERE roleid = 40;

INSERT INTO rolePermissions SET roleid = 10, permissionid = 164;
INSERT INTO rolePermissions SET roleid = 20, permissionid = 174;
INSERT INTO rolePermissions SET roleid = 30, permissionid = 174;
INSERT INTO rolePermissions SET roleid = 40, permissionid = 174;
INSERT INTO rolePermissions SET roleid = 50, permissionid = 194;

ALTER TABLE users
	ADD COLUMN 	`membershipStart` DATETIME NULL,
    ADD COLUMN `hours` INT NOT NULL DEFAULT 0,
    ADD COLUMN `hoursNext` INT NOT NULL DEFAULT 0
;