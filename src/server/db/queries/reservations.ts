import { Query } from '../';
import { IReservation } from '../../../utils/models';

const getMonth = async () => await Query('SELECT * FROM reservationAvailability');      //only pulls availability, no details

const getDay = async (date: string) => await Query('SELECT * FROM reservations WHERE startTime LIKE ?', [date]);      //pulls reservation details for one particular day

const getHour = async (hour: string) => await Query('SELECT * FROM reservations WHERE startTime <= ? && endtime > ?', [hour, hour]);   //pulls reservation details for a specific hour

const getUser = async (id: number) => await Query('SELECT * FROM reservations WHERE userid = ?', [id]);     //pulls one user's reservations

const post = async (reservation: IReservation) => await Query('INSERT INTO reservations SET ?', [reservation]);     //make new reservation

const updateRes = async (id: number, reservation: IReservation) => await Query('UPDATE reservations SET ? WHERE id = ?', [reservation, id]); //updates reservation details

const deleter = async (id: number) => await Query('DELETE FROM reservations WHERE id = ?', [id]);   //delete a reservation entirely (will not save any info)

const updateDay = async (newDay: Date, yesterday: Date) => {    //only used to move the availability table forward each day
    let insertResponse = await Query('INSERT INTO reservationAvailability SET date = ?', [newDay]);
    let deleteResponse = await Query('DELETE FROM reservationAvailability WHERE date = ?', [yesterday]);
    return [insertResponse, deleteResponse];
};

const updateAvail = async (date: Date, publicHours: number, privateHours: number, teamHours: number, vrHours: number, fullTournamentHours: number) => (
    Query('UPDATE reservationAvailability SET public = public - ?, private = private - ?, team = team - ?, vr = vr - ?, fullTournament = fullTournament - ? WHERE date = ?', 
    [publicHours, privateHours, teamHours, vrHours, fullTournamentHours, date])
);  //will update hours if necessary on the day that was just added by the updateDay func

export default {
    getMonth,
    getDay,
    getHour,
    getUser,
    post,
    updateRes,
    deleter,
    updateDay,
    updateAvail
}