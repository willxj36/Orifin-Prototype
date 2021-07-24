import * as mysql from 'mysql';

import config from '../config';

import Users from './queries/users';
import AccessTokens from './queries/accesstokens';
import Roles from './queries/roles';
import Reservations from './queries/reservations'
import Employees from './queries/employees';

export const pool = mysql.createPool(config.mysql);

export const Query = (query: string, values?: any) => {
    return new Promise<Array<any>>((resolve, reject) => {
        pool.query(query, values, (err, results) => {
            err ? reject(err) : resolve(results);
        })
    })
};

export default {
    Users,
    AccessTokens,
    Roles,
    Reservations,
    Employees
}