import * as express from 'express';
import * as passport from 'passport';

import { createToken } from '../../../utils/security/tokens';

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

export default router;