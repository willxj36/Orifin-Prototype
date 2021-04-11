import * as React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { IReservation, IUser } from '../../utils/models';
import ResListRow from './ResListRow';

interface IUserResListProps {
    userInfo: IUser,
    reservations: IReservation[]
}

const UserResList: React.FC<IUserResListProps> = ({ userInfo, reservations }) => {

    const [futureRes, setFutureRes] = useState<IReservation[]>();   //array of upcoming reservations for user
    const [pastRes, setPastRes] = useState<IReservation[]>();   //array of past reservations with most recent first to facilitate limiting to most recent 5 or other number

    useEffect(() => {
        if(!reservations) return;
        setFutureRes((reservations.filter(res => res.startTime > new Date())));
        setPastRes((reservations.filter(res => res.startTime < new Date())).reverse());
    }, [reservations])

    return(
        <div className="card rounded bg-gold">
            {userInfo && reservations ? (
                <>
                    <div className="card-header">
                        <h5 className="card-title"><b>Full Reservation List</b></h5>
                    </div>
                    <div className="card-body">
                        <h6 className="card-subtitle"><b>Last 5 Visits</b></h6>
                        <ResListRow reservation={reservations[0]} />
                    </div>
                </>
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResList;