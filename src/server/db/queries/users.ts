import { Query } from '../';
import { IUser } from '../../../utils/models';

const getAll = async () => Query('SELECT * FROM users');

const checkEmail = async(email: string) => Query('SELECT email FROM users WHERE email LIKE ?', [email]);

const findOne = async(column: string, value: string | number) => Query('SELECT * FROM users WHERE ?? LIKE ? LIMIT 1', [column, value]);

const findBy = async(column: string, value: string | number) => Query('SELECT * FROM users WHERE ?? LIKE ?', [column, value]);

const post = async(user: IUser) => Query('INSERT INTO users SET ?', [user]);

const put = async(user: IUser, id: number) => Query('UPDATE users SET ? WHERE id = ?', [user, id]);

const deleter = async(id: number) => Query('DELETE FROM users WHERE id = ?', [id]);

export default {
    getAll,
    checkEmail,
    findOne,
    findBy,
    post,
    put,
    deleter
}