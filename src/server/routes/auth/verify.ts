import * as express from 'express';
import * as passport from 'passport';

import db from '../../db';
import { comparePass } from '../../../utils/security/passwords';

const router = express.Router();

router.post('/', async (req: any, res) => {
    try {
        let [user]: any = await db.Users.findOne('email', req.body.email);
        if(user && comparePass(req.body.password, user.password)) {
            res.status(200).json({message: 'User verified!'})
        } else {
            res.status(401);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;