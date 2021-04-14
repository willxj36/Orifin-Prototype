import * as express from 'express';

import { IReservation } from '../../../utils/models';
import db from '../../db';

const router = express.Router();

router.get('/db', async (req, res) => {
    try {
        let days = await db.Reservations.getMonth();
        let year: number = new Date().getFullYear();    //need to pull these off of today's date so we can reconstruct with no time
        let month: number = new Date().getMonth();
        let date: number = new Date().getDate();
        let latestDateIn: Date = days[days.length - 1].date || new Date(year, month, date - 1);    //latest day currently in the table
        let latestDateAdd: Date = new Date(year, month, date + 31);   //latest day to be added to end of table (month will auto-update when date + 31 goes over the end of the month)
        let newDateArr = [];
        for(let i = latestDateIn.getTime() + 86400000; i <= latestDateAdd.getTime(); i = i + 86400000) {
            newDateArr.push(new Date(i));
        }
        let today: Date = new Date(year, month, date);    //today; any days before this to be deleted off end of table

        let resHoursArr: any[] = [];
        newDateArr.forEach(async (day) => { //runs over every missing date to add it to the table, then update hours in case admins have made reservations beyond the month
            let response: any = await db.Reservations.updateDay(day, today);  //db query that causes the update
            console.log(response);

            let dateString: string = `${day.getFullYear()}-${(day.getMonth() + 1) < 10 ? '0' : ''}${day.getMonth() + 1}-${day.getDate() < 10 ? '0' : ''}${day.getDate()}`;
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
            let resHours: any = await db.Reservations.updateAvail(day, publicHours, privateHours, teamHours, vrHours, fullTournamentHours); 
            //updates availability table to make sure the calendar page stays accurate
            console.log(resHours);
            resHoursArr.push(resHours);
        });

        res.json({resHoursArr, message: 'check db to verify success'});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/hours', async (req, res) => {
    try {
        let year: number = new Date().getFullYear();    //need to pull these off of today's date so we can reconstruct with no time
        let month: number = new Date().getMonth();
        let date: number = new Date().getDate();
        let dates: number[] = [];
        dates.push(date);   //dates should only ever be 1 or 2 in length; 2 should only be when the previous month is less than 31 days long
        if(date < 3) {  //determines which date from 2 months previous should be included in the reset (when membershipStart date is greater than the number of days
            //in the previous month. e.g. member joined Jan 31, his hours would not reset in Feb, so should be reset Mar 3). Saves from writing functions for each specific month
            let lastDay: number = new Date(year, month - 1, 0).getDate();    //get the number of last day of month 2 months before current month
            let altDate: number = new Date(year, month, date - lastDay).getDate();  //gets number of date from 2 months previous that should have hours reset on this day
            altDate > 3 && dates.push(altDate);     //prevent repeats in the array which could cause funky reset behavior
        }
        let response = await db.Users.resetHours(dates);
        console.log(response);
        res.json(response);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;