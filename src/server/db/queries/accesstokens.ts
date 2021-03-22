import { Query } from '../';

const get = async (id: number, token: string) => await Query('SELECT * FROM accesstokens WHERE id = ? AND token = ?', [id, token]);

const post = async (userid: number) => await Query('INSERT INTO accesstokens SET userid = ?', [userid]);

const put = async (id: number, token: string) => await Query('UPDATE accesstokens SET token = ? WHERE id = ?', [token, id]);

const deleter = async (userid: number) => await Query('DELETE FROM accesstokens WHERE userid = ?', [userid]);

export default { 
    get, 
    post, 
    put, 
    deleter 
};