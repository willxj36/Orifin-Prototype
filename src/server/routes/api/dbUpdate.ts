import * as express from 'express';
import db from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let year: number = new Date().getFullYear();
        let month: number = new Date().getMonth();
        let date: number = new Date().getDate();
        let response: any = await db.Reservations.updateDay(new Date(year, month, date + 31), new Date(year, month, date - 1));
        console.log(response);
        if(response[0].affectedRows && response[1].affectedRows) {
            res.json({message: 'success'});
        } else {
            res.json({message: 'failure'});;
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;