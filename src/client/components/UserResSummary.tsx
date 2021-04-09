import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { IReservation, IUser } from '../../utils/models';
import { UserContext, IContextUser } from '../components/ContextProvider';

interface IUserResSummaryProps {
    reservations: IReservation[],
    userInfo: IUser
}

const UserResSummary: React.FC<IUserResSummaryProps> = ({ reservations, userInfo }) => {

    const [user,] = useContext<IContextUser>(UserContext);

    const [hourMax, setHourMax] = useState<number>(0);

    useEffect(() => {   //converts strings back into dates for usefulness
        if(reservations) {
            reservations.forEach(res => {
                res.startTime = new Date(res.startTime);
                res.endTime = new Date(res.endTime);
            });
        }
    }, [reservations])

    useEffect(() => {
        if(user.userid) {
            if(user.role == 20) setHourMax(30);
            if(user.role == 30) setHourMax(50);
            if(user.role == 40) setHourMax(100);
        }
    }, [user]);

    return(
        <div className="card rounded bg-gold">
            {userInfo && reservations ? (
                <>
                    <div className="card-header">
                        <h5><b>Reservation Summary</b></h5>
                    </div>
                    <div className="card-body">
                        <p><b>Hours used this period:</b> {userInfo.hours}{hourMax ? `/${hourMax}` : null}</p>
                        <p>
                            <b>Next reservation at:</b> {((reservations.filter(res => res.startTime > new Date()))[0])?.startTime.toString() || (
                                <>
                                    <span>No upcoming reservations</span>
                                    <span><Link to="/calendar" className="ml-2"><b><i>Book a spot!</i></b></Link></span>
                                </>
                            )}
                        </p>
                    </div>
                </>
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResSummary;