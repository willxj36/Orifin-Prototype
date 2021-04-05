import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
import ResConfirmation from '../components/ResConfirmation';
import { IUser, IReservation } from '../../utils/models';

interface IReservationParams {
    type: string,
    time: string,
    spots: string
}

interface IReservationProps {
    location: {
        pathname: string,
        state: IReservation[]
    }
}

interface IMaxHours {
    hours: number,
    beforeDayEnd: boolean
}

interface IPostResponse {
    message: string,
    reservationId: string
}

const Reservation: React.FC<IReservationProps> = ({ location }) => {

    const reservations = location.state;

    const [user,] = useContext<IContextUser>(UserContext);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();   //needed for clearTimeout to work, any other variables reset on any state change
    const [userEmail, setUserEmail] = useState<string>('');     //comes from api call after context is loaded

    const [dateStart, setDateStart] = useState<Date>();     //Date object of exact time of res start based on params
    const [dateEnd, setDateEnd] = useState<Date>();         //Date object of end time of res based on hours selected
    const [hours, setHours] = useState<number>(0);          //hour length of res; could calc this one from dateStart and dateEnd, but this will simplify other code
    const [headset, setHeadset] = useState<boolean>(false); //indicates if headset is requested
    const [monitor, setMonitor] = useState<boolean>(false); //same as above but for monitor

    const [maxHours, setMaxHours] = useState<IMaxHours>({   //max hours allowed for this res based on either availability, or end of day
        hours: 0,
        beforeDayEnd: false
    });
    const [showMaxMessage, setShowMaxMessage] = useState<boolean>(false);
    const [spots, setSpots] = useState<number>(0);  //placeholder for now, can be used later to reserve multiple spots but for now, 1 user 1 reservation

    const [btnDisable, setBtnDisable] = useState<boolean>(true);
    const [confirm, setConfirm] = useState<boolean>(false);

    const params = useParams<IReservationParams>();
    const history = useHistory();

    const [fullData, setFullData] = useState<IReservation>(); //used to pass info to confirmation screen

    useEffect(() => {
        clearTimeout(timeoutId);    //page refresh would cause a redirect to login because no user, then to member page as it found the user. The timeout here prevents that.
        if (!user?.userid) {
            setTimeoutId(setTimeout(() => history.push(`/login/${params.type}/${params.time}/${params.spots}`), 50));
        } else {
            (async () => {
                let userInfo: IUser = await apiService(`/api/users/id/${user.userid}`); //grabs user email to show who they're logged in as
                setUserEmail(userInfo.email);                                           //server will authenticate regardless since the userid is just pulled from localstorage
            })();
        }
    }, [user]);

    useEffect(() => {       //revert params back into useful types
        let time = Number(params.time);
        setDateStart(new Date(time));
        setSpots(Number(params.spots));
    }, [params]);

    useEffect(() => {       //determines max number of hours based on availability for each hour after start time or end of day if availability is open
        if (!dateStart || !reservations || !params) return;
        let resThisType = reservations.filter(res => res.type === params.type);     //returns only reservations of same type
        let resHours: IReservation[][] = [];
        for (let i = 0; i < 24 - dateStart.getHours(); i++) {    //creates arrays for reservations that interfere with each hour, then pushes those to resHours array
            let thisHour = resThisType.filter(res => {
                let hour = dateStart.getTime() + (i * 3600000);
                return res.startTime.getTime() <= hour && res.endTime.getTime() > hour;
            })
            resHours.push(thisHour);
        }
        const maxSpots = params.type === 'public' ? 10 : (params.type === 'private' ? 5 : 1);
        for (const hour of resHours) {
            if (hour.length === maxSpots) {      //length of each array = number of stations that will be taken for that hour
                setMaxHours({
                    hours: resHours.indexOf(hour),  //index of resHours where this happens (if it does) conveniently matches the number of hours from start time until that point
                    beforeDayEnd: true              //beforeDayEnd state determines what message pops up when someone chooses the max hours
                });
                break;
            } else if (resHours.indexOf(hour) === resHours.length - 1) {
                setMaxHours({
                    hours: resHours.length,
                    beforeDayEnd: false
                });
            }
        }
    }, [reservations, dateStart, params]);

    useEffect(() => {       //ensures reservation can't be submitted until the hours are determined and are not 0
        if (dateEnd) {
            if (dateEnd.getTime() !== dateStart.getTime()) {
                setBtnDisable(false);
            } else {
                setBtnDisable(true);
            }
        }
    }, [dateEnd]);

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let hours = Number(e.currentTarget.value);
        setHours(hours);
        setShowMaxMessage(hours === maxHours.hours ? true : false);
        let endHours = new Date(Number(params.time) + (hours * 3600000));
        setDateEnd(endHours);
    }

    const handleSubmit = async () => {  //this function makes several checks to ensure no double bookings/overbooking/etc before submitting
        setBtnDisable(true);

        const formattedDate = `${dateStart.getFullYear()}-${(dateStart.getMonth() + 1) < 10 ? '0' : ''}${dateStart.getMonth() + 1}-${dateStart.getDate() < 10 ? '0' : ''}${dateStart.getDate()}`;
        let newReservations: IReservation[] = await apiService(`/api/reservations/date/${formattedDate}`);  //gets reservations on submit to ensure a new res hasn't submitted since this reservation process started
        let resHours: IReservation[][] = [];
        for (let i = 0; i < hours; i++) {    //creates arrays for reservations that interfere with each hour, then pushes those to resHours array
            let thisHour = newReservations?.filter(res => {
                let hour = dateStart.getTime() + (i * 3600000);
                return new Date(res.startTime).getTime() <= hour && new Date(res.endTime).getTime() > hour;
            })
            resHours.push(thisHour);
        }

        let idBooked: boolean = resHours.some(hourArr => hourArr.some(res => res.userid == user.userid));  //checks all res with time overlap for same userid (no double booking)
        if (idBooked) {
            alert('Chosen time slot overlaps with a booked reservation for your User ID. Please check your existing reservations and try again.');
            return;
        }

        resHours = resHours.map(hourArr => hourArr.filter(res => res.type === params.type));    //returns res only of same type
        const maxSpots = params.type === 'public' ? 10 : (params.type === 'private' ? 5 : 1);
        let available: boolean = !resHours.some(hourArr => hourArr.length === maxSpots);     //check for availability again with newly loaded reservations

        let monitorid: number;
        if (monitor) {
            let monitorUse = newReservations.filter(res => res.monitorid);   //make new array of reservations that have monitors requested
            let resMonitors: IReservation[][] = [];     //break down res with monitor by hour
            for (let i = 0; i < hours; i++) {
                let thisHour = monitorUse.filter(res => {
                    let hour = dateStart.getTime() + (i * 3600000);
                    return res.startTime.getTime() <= hour && res.endTime.getTime() > hour;
                })
                resMonitors.push(thisHour);
            };
            let highest: number = 0;
            let fullHourArr: number[] = [];
            for (const hour of resMonitors) {
                if (hour.length > highest) highest = hour.length;
                if (hour.length === 5) fullHourArr.push(resMonitors.indexOf(hour));
            }
            monitorid = fullHourArr.length === hours ? null : highest + 1;
        }

        let headsetid: number;
        if (headset) {
            let headsetUse = newReservations.filter(res => res.headsetid);   //make new array of reservations that have headsets requested
            let resHeadsets: IReservation[][] = [];     //break down res with headset by hour
            for (let i = 0; i < hours; i++) {
                let thisHour = headsetUse.filter(res => {
                    let hour = dateStart.getTime() + (i * 3600000);
                    return res.startTime.getTime() <= hour && res.endTime.getTime() > hour;
                })
                resHeadsets.push(thisHour);
            };
            let highest: number = 0;
            let fullHourArr: number[] = [];
            for (const hour of resHeadsets) {
                if (hour.length > highest) highest = hour.length;
                if (hour.length === 5) fullHourArr.push(resHeadsets.indexOf(hour));
            }
            headsetid = fullHourArr.length === hours ? null : highest + 1;
        }

        if (available) {
            let resData: IReservation = {
                hours,
                startTime: dateStart,
                endTime: dateEnd,
                userid: user.userid,
                type: params.type,
                monitorid,
                headsetid
            }
            let response: IPostResponse = await apiService(`/api/reservations/${user.userid}`, 'POST', resData);
            resData.id = Number(response.reservationId);
            setFullData(resData);
            alert(response.message);
            setConfirm(true);
        } else {
            history.push(`/calendar/${formattedDate}`);
            alert('Oops, looks like someone beat you to the finish line! The available spots were taken right before you submitted. Please check the updated availability and make a new reservation!');
        }
    }

    return (
        <div className="min-vh-100 bg-deepred d-flex flex-column justify-content-center align-items-center">

            {!confirm && (
                <>
                    <div className="p-4 mt-md-n5 mt-5 col col-md-6 col-xl-4 container rounded" style={{ background: 'linear-gradient(210deg, #FFD766, silver)' }}>
                        <h5 className="text-center"><i><b>One more step! Please confirm the following info and choose hours and equipment</b></i></h5>
                    </div>

                    <div className="my-2" style={{ height: 3, width: 700, backgroundColor: 'silver', borderRadius: 2 }}></div>

                    <div className="p-4 col col-md-6 col-xl-4 container rounded" style={{ background: 'linear-gradient(330deg, #FFD766, silver)' }}>

                        <p className="text-center"><b><i>Logged in as:</i></b> {userEmail}</p>
                        <p className="text-center"><b><i>Reservation for:</i></b> {dateStart?.toDateString()}</p>
                        <p className="text-center"><b><i>At:</i></b> {dateStart?.toTimeString()}</p>
                        <p className="text-center"><b><i>Until:</i></b> {dateEnd ? dateEnd?.toTimeString() : 'Please choose hours'}</p>
                        <p className="text-center"><b><i>Station:</i></b> {params.type[0].toUpperCase() + params.type.slice(1)}</p>

                        <div className="d-flex flex-column align-items-center">
                            <label htmlFor="hoursSelect">How many hours?</label>
                            <input onChange={(e) => handleEndChange(e)} className="form-control mb-4 col-4" type="number" min="0" max={maxHours.hours} name="hoursSelect" id="hoursSelectInput" />

                            {showMaxMessage && (
                                <p className="text-danger text-center">{maxHours.beforeDayEnd ? (
                                    'No availability beyond current number of hours selected'
                                ) : (
                                    'To continue reservation past midnight, please make a separate reservation for following day AFTER submitting this reservation'
                                )}
                                </p>
                            )}

                            <p><b><i><u>Extra Equipment Rental</u></i></b></p>
                            <label htmlFor="monitorSelect"><b>Extra Monitor</b></label>
                            <select onChange={(e) => setMonitor(e.currentTarget.value === 'yes' ? true : false)} className="form-control mb-2 col-4" name="monitorSelect" id="monitorSelect">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                            <label htmlFor="headsetSelect"><b>Headset</b></label>
                            <select onChange={(e) => setHeadset(e.currentTarget.value === 'yes' ? true : false)} className="form-control mb-4 col-4" name="headsetSelect" id="headsetSelect">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                            <button onClick={handleSubmit} className="btn btn-darkinfo" disabled={btnDisable}>Make Reservation</button>
                        </div>

                    </div>
                </>
            )}

            {confirm && <ResConfirmation data={fullData} />}

        </div>
    )
}

export default Reservation;