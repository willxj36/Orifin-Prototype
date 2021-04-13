import * as express from 'express';
import * as passport from 'passport';

import db from '../../db';

import { IUser } from '../../../utils/models';
import { isAdmin, isAdminOrUser } from '../../middleware/requestHandlers';

const router = express.Router();

router.get('/check-email/:email', async (req, res) => {
    let email = req.params.email;
    try {
        let [emailCheck] = await db.Users.checkEmail(email);
        res.json(emailCheck);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Email check failed'});
    }
})

router.get('/:column/:value', async (req, res) => {
    let column = req.params.column;
    let value = req.params.value;
    try {
        let [user]: any = await db.Users.findOne(column, value);
        if(user) {
            delete user.password;
            res.json(user);
        } else {
            res.sendStatus(204);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'User fetch failed, please try again'});
    }
})

router.get('/', passport.authenticate('bearer'), isAdmin, async (req: any, res) => {
    try {
        let users: IUser[] = await db.Users.getAll();
        users.forEach(user => delete user.password);
        res.json(users);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.put('/:userid', passport.authenticate('bearer'), isAdminOrUser, async (req: any, res) => {   //userid param is needed for request handler
    try {
        let response: any = await db.Users.put(req.body, req.user.id);
        if(response.affectedRows) {
            res.json({message: 'User successfully updated!'});
        } else {
            res.sendStatus(500);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;