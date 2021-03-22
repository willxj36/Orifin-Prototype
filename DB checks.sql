SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM accesstokens;

DELETE FROM users WHERE id = 16;
DELETE FROM accesstokens WHERE id > 0;