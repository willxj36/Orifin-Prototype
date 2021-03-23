SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM permissions;
SELECT * FROM rolePermissions;
SELECT * FROM accesstokens;

SELECT p.permission FROM permissions p
        JOIN rolePermissions rp ON rp.permissionid = p.id
        JOIN roles r ON r.id = rp.roleid
        WHERE r.id = 1;

DELETE FROM users WHERE id = 16;
DELETE FROM accesstokens WHERE id > 0;