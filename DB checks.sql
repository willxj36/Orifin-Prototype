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
DELETE FROM accesstokens WHERE id > 0;
DELETE FROM rolePermissions WHERE roleid > 0;
INSERT INTO reservationAvailability SET date = '2021-04-29 00:00:00';
DELETE FROM reservations WHERE id > 0;