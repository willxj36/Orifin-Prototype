import * as express from 'express';
import * as passport from 'passport';

import db from '../../db';

import { IUser } from '../../../utils/models';
import { isAdmin, isAdminOrUser } from '../../middleware/requestHandlers';

const router = express.Router();

router.get('/check-username/:username', async (req, res) => {
    let username = req.params.username;
    try {
        let [usernameCheck] = await db.Employees.checkUsername(username);
        res.json({exists: !!usernameCheck});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Username check failed'});
    }
})

export default router