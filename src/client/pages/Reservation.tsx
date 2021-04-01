import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
import { IUser } from '../../utils/models';

interface IReservationParams {
    type: string,
    time: string,
    spots: string
}

const Reservation = () => {

    const [user,] = useContext<IContextUser>(UserContext);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const [userEmail, setUserEmail] = useState<string>('');

    const [dateStart, setDateStart] = useState<Date>();
    const [dateEnd, setDateEnd] = useState<Date>();
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
                let userInfo: IUser = await apiService(`/api/users/id/${user.userid}`);
                setUserEmail(userInfo.email);
            })();
        }
    }, [user]);

    useEffect(() => {       //revert params back into useful types
        let time = Number(params.time);
        setDateStart(new Date(time));
        setSpots(Number(params.spots));
    }, [params]);

    useEffect(() => {       //ensures reservation can't be submitted until the hours are determined and are not 0
        if(dateEnd) {
            if(dateEnd !== dateStart) {
                setBtnDisable(false);
            } else {
                setBtnDisable(true);
            }
        }
    }, [dateEnd]);

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let hours = Number(e.currentTarget.value);
        let endHours = new Date(Number(params.time) + (hours * 3600000));
        setDateEnd(endHours);
    }

    const handleSubmit = async () => {
        let response = await apiService(`/api/reservations/${user.userid}`, 'POST', {
            
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
                    <input onChange={(e) => handleEndChange(e)} className="form-control mb-4 col-4" type="number" name="hoursSelect" id="hoursSelectDropdown"/>
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