import * as express from 'express';

import { IReservation } from '../../../utils/models';
import db from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let year: number = new Date().getFullYear();    //need to pull these off of today's date so we can reconstruct with no time
        let month: number = new Date().getMonth();
        let date: number = new Date().getDate();
        let newDate: Date = new Date(year, month, date + 31);   //day to be added to end of table (month will auto-update when date + 31 goes over the end of the month)
        let oldDate: Date = new Date(year, month, date - 1);    //yesterday; to be deleted off end of table
        let response: any = await db.Reservations.updateDay(newDate, oldDate);  //db query that causes the update
        console.log(response);

        let dateString: string = `${newDate.getFullYear()}-${(newDate.getMonth() + 1) < 10 ? '0' : ''}${newDate.getMonth() + 1}-${newDate.getDate() < 10 ? '0' : ''}${newDate.getDate()}`;
        //looks complicated, but just properly formats the date into something useful for the following db query
        let reservations: IReservation[] = await db.Reservations.getDay(dateString);    
        //pull reservations from new day being added (admin/webmaster can add reservations beyond the month that most users can)
        let publicHours = 0;
        let privateHours = 0;
        let teamHours = 0;
        let vrHours = 0;
        let fullTournamentHours = 0;
        reservations.forEach(res => {   //adds up hours for each category for the new day. there should rarely be anything here, but catching these edge cases will save serious headaches
            if(res.type === 'public') publicHours = publicHours + ((res.endTime.getTime() - res.startTime.getTime())/3600000);
            if(res.type === 'private') privateHours = privateHours + ((res.endTime.getTime() - res.startTime.getTime())/3600000);
            if(res.type === 'team') teamHours = teamHours + ((res.endTime.getTime() - res.startTime.getTime())/3600000);
            if(res.type === 'vr') vrHours = vrHours + ((res.endTime.getTime() - res.startTime.getTime())/3600000);
            if(res.type === 'fullTournament') fullTournamentHours = 1;
        })
        let resHours: any = await db.Reservations.updateAvail(newDate, publicHours, privateHours, teamHours, vrHours, fullTournamentHours); 
        //updates availability table to make sure the calendar page stays accurate
        console.log(resHours);

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