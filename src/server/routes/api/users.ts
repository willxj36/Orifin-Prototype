import * as express from 'express';

import db from '../../db';

import { IUser } from '../../../utils/models';

const router = express.Router();

router.get('/:column?/:value?', async (req, res) => {
    let column = req.params.column;
    let value = req.params.value;
    try {
        if(column) {
            if(value) {
                let [user]: any = await db.Users.findOne(column, value);
                if(user) {
                    delete user.password;
                    res.send(user);
                } else {
                    res.sendStatus(204);
                }
            } else {
                //db logic for grabbing all users but for only the one column mentioned
                //may use for 'front desk' kind of use where all users info needed, but protecting sensitive info from employees without authorization to see it
                //may not be needed, we'll see what logic is req'd
            }
        } else {
            let users: IUser[] = await db.Users.getAll();
            users.forEach(user => delete user.password);
            res.send(users);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'User fetch failed, please try again'});
    }
})

export default router;