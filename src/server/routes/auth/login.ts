import * as express from 'express';
import * as passport from 'passport';

import { createToken } from '../../../utils/security/tokens';
import { isEmployee } from '../../middleware/requestHandlers'

const router = express.Router();

router.post('/', passport.authenticate('local'), async (req: any, res) => {
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

router.post('/employee', passport.authenticate('local'), isEmployee, async (req: any, res) => {
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

export default router;