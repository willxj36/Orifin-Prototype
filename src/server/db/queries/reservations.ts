import { Query } from '../';
import { IReservation } from '../../../utils/models';

const getMonth = async () => await Query('SELECT * FROM reservationAvailability');      //only pulls availability, no details

const getDay = async (date: string) => await Query('SELECT * FROM reservations WHERE startTime LIKE ?', [date]);      //pulls reservation details for one particular day

const getHour = async (hour: string) => await Query('SELECT * FROM reservations WHERE startTime <= ? && endtime > ?', [hour, hour]);   //pulls reservation details for a specific hour

const getUser = async (id: number) => await Query('SELECT * FROM reservations WHERE userid = ?', [id]);     //pulls one user's reservations

const post = async (reservation: IReservation) => await Query('INSERT INTO reservations SET ?', [reservation]);     //make new reservation

const updateRes = async (id: number, reservation: IReservation) => await Query('UPDATE reservations SET ? WHERE id = ?', [reservation, id]); //updates reservation details

const deleter = async (id: number) => await Query('DELETE FROM reservations WHERE id = ?', [id]);

const updateDay = async (newDay: Date, yesterday: Date) => {
    let insertResponse = await Query('INSERT INTO reservationAvailability SET date = ?', [newDay]);
    let deleteResponse = await Query('DELETE FROM reservationAvailability WHERE date = ?', [yesterday]);
    return [insertResponse, deleteResponse];
};

export default {
    getMonth,
    getDay,
    getHour,
    getUser,
    post,
    updateRes,
    deleter,
    updateDay
}