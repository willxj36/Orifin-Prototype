import * as express from 'express';

import db from '../../db';
import { hashPass } from '../../../utils/security/passwords';
import { createToken } from '../../../utils/security/tokens';

import { IUser } from '../../../utils/models';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let user: IUser = req.body;
        user.password = hashPass(req.body.password)
        let response: any = await db.Users.post(req.body);
        let token = await createToken({userid: response.insertId});
        res.json({
            message: 'Registration successful',
            token,
            roleid: 1,
            userid: response.insertId
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;