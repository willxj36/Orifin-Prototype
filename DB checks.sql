SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM permissions;
SELECT * FROM rolePermissions;
SELECT * FROM accesstokens;
SELECT * FROM reservationAvailability;
SELECT * FROM reservations;
SELECT * FROM monitors;
SELECT * FROM headsets;
SELECT p.permission FROM permissions p
        JOIN rolePermissions rp ON rp.permissionid = p.id
        JOIN roles r ON r.id = rp.roleid
        WHERE r.id = 30;

DELETE FROM users WHERE id > 0;
DELETE FROM reservations WHERE id > 0;
DELETE FROM accesstokens WHERE id > 0;
DELETE FROM rolePermissions WHERE roleid > 0;
DELETE FROM reservationAvailability WHERE date > '2021-05-11 00:00:00';

UPDATE users SET membershipStart = '2021-03-31 00:00:00' WHERE id = 10;

INSERT INTO reservations SET startTime = '2021-04-03 12:00:00', endTime = '2021-04-03 20:00:00', userid='10', type='team';
INSERT INTO monitors SET id = '10';