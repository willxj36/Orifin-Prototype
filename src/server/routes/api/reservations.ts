import * as express from 'express';
import db from '../../db';
import * as passport from 'passport';
import { isAdminOrUser } from '../../middleware/requestHandlers';

const router = express.Router();

router.get('/date/:date/:hour?', async (req, res) => {
    let dateRaw = req.params.date;
    if(req.params.hour) {
        try {
            let hourRaw = req.params.hour;
            let hour = `${hourRaw}:00:00`;
            let reservations = await db.Reservations.getHour(`${dateRaw} ${hour}`);
            res.json(reservations);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    } else {
        try {
            let date = `${dateRaw}%`
            let reservations = await db.Reservations.getDay(date);
            res.json(reservations);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
});

router.get('/user/:userid', passport.authenticate('bearer'), isAdminOrUser, async (req, res) => {
    try {
        let id = Number(req.params.id);
        let reservations = await db.Reservations.getUser(id);
        res.json(reservations);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/', async (req, res) => {
    try {
        let reservations = await db.Reservations.getMonth();
        res.json(reservations);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/:userid', passport.authenticate('bearer'), isAdminOrUser, async (req, res) => {   //userid param is required for the request handler
    try {
        let dateTime: Date = new Date(req.body.startTime);   //this block updates availability table
        let date: Date = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()); //1st 2 lines here assure the right date is being updated separate from timezone
        let publicHours: number = req.body.type === 'public' ? req.body.hours : 0;
        let privateHours: number = req.body.type === 'private' ? req.body.hours : 0;
        let teamHours: number = req.body.type === 'team' ? req.body.hours : 0;
        let vrHours: number = req.body.type === 'vr' ? req.body.hours : 0;
        let fullTournamentHours: number = req.body.type === 'fullTournament' ? 1 : 0;
        let availResponse: any = await db.Reservations.updateAvail(date, publicHours, privateHours, teamHours, vrHours, fullTournamentHours);
        console.log(availResponse);

        let userHourRes: any = await db.Users.addHours(req.body.userid, req.body.hours);    //updates hours for user making reservation
        console.log(userHourRes);

        delete req.body.hours;
        req.body.startTime = new Date(req.body.startTime);
        req.body.endTime = new Date(req.body.endTime);
        let response: any = await db.Reservations.post(req.body);   //posts the reservation
        if(response.insertId) {
            res.json({message: 'Reservation made!', reservationId: response.insertId});
        } else {
            res.json({message: 'Something went wrong, please try again. If problem persists, please contact tech support'});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.put('/:userid/:id', passport.authenticate('bearer'), isAdminOrUser, async (req, res) => {
    try {
        let id = Number(req.params.id);
        let response: any = await db.Reservations.updateRes(id, req.body);
        if(response.affectedRows) {
            res.json({message: 'Reservation updated!'});
        } else {
            res.json({message: 'Something went wrong, please try again. If problem persists, please contact tech support'});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.delete('/:userid/:id', passport.authenticate('bearer'), isAdminOrUser, async (req, res) => {
    try {
        let id = Number(req.params.id);
        let response: any = await db.Reservations.deleter(id);
        if(response.affectedRows) {
            res.json({message: 'Reservation canceled'});
        } else {
            res.json({message: 'Reservation failed to update, please try again. If problem persists, please contact tech support'});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})


export default router;