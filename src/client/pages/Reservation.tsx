import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import { UserContext, IContextUser } from '../components/ContextProvider';

interface IReservationParams {
    type: string,
    time: string,
    spots: string
}

const Reservation = () => {

    const [user,] = useContext<IContextUser>(UserContext);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    const [date, setDate] = useState<Date>();
    const [spots, setSpots] = useState<number>(0);  //placeholder for now, can be used later to reserve multiple spots but for now, 1 user 1 reservation

    const params = useParams<IReservationParams>();
    const history = useHistory();

    useEffect(() => {
        clearTimeout(timeoutId);    //page refresh would cause a redirect to login because no user, then to member page as it found the user. The timeout here prevents that.
        if(!user?.userid) {
            setTimeoutId(setTimeout(() => history.push(`/login/${params.type}/${params.time}/${params.spots}`), 50));
        }
    }, [user]);

    useEffect(() => {
        let time = Number(params.time);
        setDate(new Date(time));
        setSpots(Number(params.spots));
    }, [params]);

    return(
        <div className="min-vh-100 bg-deepred d-flex justify-content-center align-items-center">
            <div className="p-4 container bg-gold rounded">
                <p className="text-center"><b><i>Reservation for:</i></b> {date?.toDateString()}</p>
                <p className="text-center"><b><i>At:</i></b> {date?.toTimeString()}</p>
                <div className="row justify-content-around">
                    <p><b><i>Extra Equipment Rental</i></b></p>
                    <label htmlFor="monitorSelect">Extra Monitor</label>
                    <select name="monitorSelect" id="monitorSelect">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    <label htmlFor="headsetSelect">Headset</label>
                    <select name="headsetSelect" id="headsetSelect">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Reservation;