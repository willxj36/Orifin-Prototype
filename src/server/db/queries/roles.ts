import { Query } from '../';

const getRoles = async () => await Query('SELECT * FROM roles');

const getPermissions = async (roleid: number) => await Query(
    `SELECT p.permission FROM permissions p
        JOIN rolePermissions rp ON rp.permissionid = p.id
        JOIN roles r ON r.id = rp.roleid
        WHERE r.id = ?`, [roleid]);

export default { 
    getRoles,
    getPermissions
};