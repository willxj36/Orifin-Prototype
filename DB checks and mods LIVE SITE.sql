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
INSERT INTO permissions SET permission = 'Additional hours may be purchased at discounted rate';
SELECT * FROM users;

SELECT * FROM accesstokens;

UPDATE users SET roleid = 20 WHERE id = 14;

DELETE FROM users WHERE id > 14;

INSERT INTO rolePermissions SET roleid = 10, permissionid = 4;
INSERT INTO rolePermissions SET roleid = 20, permissionid = 14;
INSERT INTO rolePermissions SET roleid = 30, permissionid = 24;