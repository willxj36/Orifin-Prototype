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

    const [hourMax, setHourMax] = useState<number>(0);  //hours allotted each month by membership type
    const [sortedRes, setSortedRes] = useState<IReservation[]>();   //reservations sorted by time instead of ID
    const [nextRes, setNextRes] = useState<string>(''); //string to represent next res formatted according to client's wishes

    useEffect(() => {
        if(!reservations) return;
        reservations.forEach(res => {       //converts strings back into Date objects
            res.startTime = new Date(res.startTime);
            res.endTime = new Date(res.endTime);
        });
        setSortedRes(reservations.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));   //sorts in order of startTime
    }, [reservations])

    useEffect(() => {   //formats date for upcoming reservation, and most recent per client's wishes
        if(!sortedRes) return;
        let fullStringNext: string = ((sortedRes.filter(res => res.startTime > new Date()))[0])?.startTime.toString();
        let stringArrNext = fullStringNext.split(' ');
        stringArrNext.splice(5, 1); //removes GMT info
        let timeArrNext = stringArrNext[4].split(':');
        let hour = Number(timeArrNext[0]);
        let time = hour < 12 ? (hour === 0 ? '12:00AM' : `${hour}:00AM`) : (hour === 12 ? `12:00PM` : `${hour - 12}:00PM`)  //turn time into user-friendly 12 hour format
        //todo: hop back in here
    }, [sortedRes])

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
                        <p><b>Hours used/reserved this period:</b> {userInfo.hours}{hourMax ? `/${hourMax}` : null}</p>
                        {userInfo.membershipStart && (
                            <p><b>Hours reserved for next period:</b> {userInfo.hoursNext}</p>
                        )}
                        <p>
                            <b>Next reservation:</b> {nextRes || (
                                <>
                                    <span>No upcoming reservations</span>
                                    <span><Link to="/calendar" className="ml-2"><b><i>Book a spot!</i></b></Link></span>
                                </>
                            )}
                        </p>
                        <p><b>Last visit:</b> {((sortedRes.filter(res => res.startTime < new Date())).reverse()[0])?.startTime.toString() || 'No recent visits'}</p>
                    </div>
                </>
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResSummary;