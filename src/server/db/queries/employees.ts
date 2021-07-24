import { Query } from '../';
import { IEmployee } from '../../../utils/models';

const getAll = async () => await Query('SELECT * FROM employees');

const checkUsername = async(username: string) => await Query('SELECT username FROM employees WHERE username LIKE ?', [username]);

const findOne = async(column: string, value: string | number) => await (
    Query(`SELECT e.id, e.firstName, e.lastName, e.password, e._created, r.role, e.roleid
        FROM employees e
        JOIN roles r ON r.id = e.roleid 
        WHERE e.?? LIKE ? LIMIT 1`,
        [column, value])
);

const findBy = async(column: string, value: string | number) => await Query('SELECT * FROM employees WHERE ?? LIKE ?', [column, value]);

const post = async(employee: IEmployee) => await Query('INSERT INTO employees SET ?', [employee]);

const put = async(employee: IEmployee, id: number) => await Query('UPDATE employees SET ? WHERE id = ?', [employee, id]);

const deleter = async(id: number) => await Query('DELETE FROM employees WHERE id = ?', [id]);

const login = async(id: number, time: Date) => await Query('INSERT INTO employeeLog SET userid = ?, login = ?', [id, time])

const logout = async(sessionID: number, time: Date) => await Query('UPDATE employeeLog SET logout = ? WHERE id = ?', [time, sessionID])

export default {
    getAll,
    checkUsername,
    findOne,
    findBy,
    post,
    put,
    deleter,
    login,
    logout
}