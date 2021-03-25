import * as express from 'express';

const router = express.Router();

router.get('/:date?', (req, res) => {
    if(req.params.date) {
        try {
            //get all reservations for the day, including non-IDing details
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    } else {
        try {
            //get all reservations for the month, but only the numbers of reservations per day per category
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
})

export default router;