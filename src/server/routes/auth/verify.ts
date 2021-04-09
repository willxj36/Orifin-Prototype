import * as express from 'express';
import * as passport from 'passport';

const router = express.Router();

router.post('/', passport.authenticate('local'), async (req: any, res) => {
    try {
        if(req.user) {
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