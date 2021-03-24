import * as express from 'express';
import * as passport from 'passport';
import db from '../../db';

const router = express.Router();

router.get('/', passport.authenticate('bearer'), async (req: any, res) => {
    try {
        let response: any = await db.AccessTokens.deleter(req.user.id)
        req.logout();
        if(response.affectedRows) {
            res.status(200).json({message: 'Logged out successfully!'});
        } else {
            res.status(200).json({message: 'Something went wrong, please try again'});
        }
    } catch (e) {
        console.log(e);
        res.json({message: e});
    }
})

export default router;