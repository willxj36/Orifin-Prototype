import * as express from 'express';
import * as passport from 'passport';

import db from '../../db'
import { createToken } from '../../../utils/security/tokens';
import { isEmployee } from '../../middleware/requestHandlers'

const router = express.Router();

router.post('/', passport.authenticate('user-local'), async (req: any, res) => {
    try {
        if(req.user) {
            let token = await createToken({ userid: req.user.id });
            res.json({
                token,
                roleid: req.user.roleid,
                userid: req.user.id,
            })
        } else {
            res.status(401);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/employee', passport.authenticate('employee-local'), isEmployee, async (req: any, res) => {    //isEmployee is redundant but may provide extra layer of security
    try {
        if(req.employee) {
            let sessionID;
            db.Employees.login(req.employee.id, new Date())
            .then((res) => {
                if((res as any).insertId) {
                    sessionID = (res as any).insertId
                } else {
                    throw new Error(`session not logged, ${req.employee.id}, ${new Date().toString()}`)
                }
            }).then(() => createToken({ userid: req.employee.id })
            ).then(token => res.json({
                token,
                roleid: req.employee.roleid,
                userid: req.employee.id,
                sessionID
            })).catch(err => console.log(err))
        } else {
            res.status(401);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;