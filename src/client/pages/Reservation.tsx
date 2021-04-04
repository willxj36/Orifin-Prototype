import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
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

const Reservation: React.FC<IReservationProps> = ({ location }) => {

    const reservations = location.state;

    const [user,] = useContext<IContextUser>(UserContext);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();   //needed for clearTimeout to work, any other variables reset on any state change
    const [userEmail, setUserEmail] = useState<string>('');     //comes from api call after context is loaded

    const [dateStart, setDateStart] = useState<Date>();     //Date object of exact time of res start based on params
    const [dateEnd, setDateEnd] = useState<Date>();         //Date object of end time of res based on hours selected
    const [hours, setHours] = useState<number>(0);          //hour length of res; could calc this one from dateStart and dateEnd, but this will simplify submission code
    const [maxHours, setMaxHours] = useState<IMaxHours>({   //max hours allowed for this res based on either availability, or end of day
        hours: 0,
        beforeDayEnd: false
    });
    const [showMaxMessage, setShowMaxMessage] = useState<boolean>(false);
    const [spots, setSpots] = useState<number>(0);  //placeholder for now, can be used later to reserve multiple spots but for now, 1 user 1 reservation

    const [btnDisable, setBtnDisable] = useState<boolean>(true);

    const params = useParams<IReservationParams>();
    const history = useHistory();

    useEffect(() => {
        clearTimeout(timeoutId);    //page refresh would cause a redirect to login because no user, then to member page as it found the user. The timeout here prevents that.
        if(!user?.userid) {
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
        if(!dateStart || !reservations || !params) return;
        let resThisType = reservations.filter(res => res.type === params.type);     //returns only reservations of same type
        let resHours: IReservation[][] = [];
        for(let i = 0; i < 24 - dateStart.getHours(); i++) {    //creates arrays for reservations that interfere with each hour, then pushes those to resHours array
            let thisHour = resThisType.filter(res => {
                let hour = dateStart.getTime() + (i * 3600000);
                return res.startTime.getTime() <= hour && res.endTime.getTime() > hour;
            })
            resHours.push(thisHour);
        }
        const maxSpots = params.type === 'public' ? 10 : (params.type === 'private' ? 5 : 1);
        for(const hour of resHours) {
            if(hour.length === maxSpots) {      //length of each array = number of stations that will be taken for that hour
                setMaxHours({
                    hours: resHours.indexOf(hour),  //index of resHours where this happens (if it does) conveniently matches the number of hours from start time until that point
                    beforeDayEnd: true              //beforeDayEnd state determines what message pops up when someone chooses the max hours
                });
                break;
            } else if(resHours.indexOf(hour) === resHours.length - 1) {
                setMaxHours({
                    hours: resHours.length,
                    beforeDayEnd: false
                });
            }
        }
    }, [reservations, dateStart, params]);

    useEffect(() => {       //ensures reservation can't be submitted until the hours are determined and are not 0
        if(dateEnd) {
            if(dateEnd.getTime() !== dateStart.getTime()) {
                setBtnDisable(false);
            } else {
                setBtnDisable(true);
            }
        }
    }, [dateEnd]);

    //need more useEffects for equipment to check its availability if/when user selects yes on either option

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let hours = Number(e.currentTarget.value);
        setHours(hours);
        setShowMaxMessage(hours === maxHours.hours ? true : false);
        let endHours = new Date(Number(params.time) + (hours * 3600000));
        setDateEnd(endHours);
    }

    const handleSubmit = async () => {
            //need logic here to verify once more on submission that there's availability (new DB pull). this will prevent over-booking if 2 people are on this page at the same time
            //then both try to submit when there's only 1 slot
        let response = await apiService(`/api/reservations/${user.userid}`, 'POST', {
            //submit res details AND hours to update res and resAvailability table
        })
    }

    return(
        <div className="min-vh-100 bg-deepred d-flex flex-column justify-content-center align-items-center">

            <div className="p-4 mt-md-n5 mt-5 col col-md-6 col-xl-4 container rounded" style={{background: 'linear-gradient(210deg, #FFD766, silver)'}}>
                <h5 className="text-center"><i><b>One more step! Please confirm the following info and choose hours and equipment</b></i></h5>
            </div>

            <div className="my-2" style={{height: 3, width: 700, backgroundColor: 'silver', borderRadius: 2}}></div>

            <div className="p-4 col col-md-6 col-xl-4 container rounded" style={{background: 'linear-gradient(330deg, #FFD766, silver)'}}>

                <p className="text-center"><b><i>Logged in as:</i></b> {userEmail}</p>
                <p className="text-center"><b><i>Reservation for:</i></b> {dateStart?.toDateString()}</p>
                <p className="text-center"><b><i>At:</i></b> {dateStart?.toTimeString()}</p>
                <p className="text-center"><b><i>Until:</i></b> {dateEnd ? dateEnd?.toTimeString() : 'Please choose hours'}</p>
                <p className="text-center"><b><i>Station:</i></b> {params.type[0].toUpperCase() + params.type.slice(1)}</p>

                <div className="d-flex flex-column align-items-center">
                    <label htmlFor="hoursSelect">How many hours?</label>
                    <input onChange={(e) => handleEndChange(e)} className="form-control mb-4 col-4" type="number" min="0" max={maxHours.hours} name="hoursSelect" id="hoursSelectInput"/>

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
                    <select className="form-control mb-2 col-4" name="monitorSelect" id="monitorSelect">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                    <label htmlFor="headsetSelect"><b>Headset</b></label>
                    <select className="form-control mb-4 col-4" name="headsetSelect" id="headsetSelect">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                    <button onClick={handleSubmit} className="btn btn-darkinfo" disabled={btnDisable}>Make Reservation</button>
                </div>

            </div>

        </div>
    )
}

export default Reservation;