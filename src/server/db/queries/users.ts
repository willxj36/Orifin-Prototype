import { Query } from '../';
import { IUser } from '../../../utils/models';

const getAll = async () => await Query('SELECT * FROM users');

const checkEmail = async(email: string) => await Query('SELECT email FROM users WHERE email LIKE ?', [email]);

const findOne = async(column: string, value: string | number) => await (
    Query(`SELECT u.id, u.firstName, u.lastName, u.email, u.password, u._created, u.membershipStart, u.hours, u.hoursNext, r.role, u.roleid
        FROM users u
        JOIN roles r ON r.id = u.roleid 
        WHERE u.?? LIKE ? LIMIT 1`,
        [column, value])
);

const findBy = async(column: string, value: string | number) => await Query('SELECT * FROM users WHERE ?? LIKE ?', [column, value]);

const post = async(user: IUser) => await Query('INSERT INTO users SET ?', [user]);

const put = async(user: IUser, id: number) => await Query('UPDATE users SET ? WHERE id = ?', [user, id]);

const deleter = async(id: number) => await Query('DELETE FROM users WHERE id = ?', [id]);

const addHours = async(id: number, hours: number, hoursNext: number) => await (
    Query('UPDATE users SET hours = hours + ?, hoursNext = hoursNext + ? WHERE id = ?', [hours, hoursNext, id])
);

const resetHours = async(dates: number[]) => (
    await Query(`UPDATE users SET hours = hoursNext, hoursNext = 0 WHERE membershipStart LIKE "%-? %"${dates.length > 1 ? ' || membershipStart LIKE "%-? %"' : ''}`, [...dates])
);

export default {
    getAll,
    checkEmail,
    findOne,
    findBy,
    post,
    put,
    deleter,
    addHours,
    resetHours
}