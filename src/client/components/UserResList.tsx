import * as React from 'react';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { IReservation, IUser } from '../../utils/models';
import ResListRow from './ResListRow';

interface IUserResListProps {
    userInfo: IUser,
    reservations: IReservation[],
    setChanged: Dispatch<SetStateAction<boolean>>
}

const UserResList: React.FC<IUserResListProps> = ({ userInfo, reservations, setChanged }) => {

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

                    <h6 className="mb-2 card-subtitle"><b><u>All Upcoming Reservations</u></b></h6>
                        <div className="col rounded border border-darkinfo">
                            <div className="row">
                                <div className="py-1 col-md-1 border border-dark">
                                    <i>Res. ID</i>
                                </div>
                                <div className="py-1 col-md-2 border border-dark">
                                    <i>Date</i>
                                </div>
                                <div className="py-1 col-md-3 border border-dark">
                                    <i>Start Time</i>
                                </div>
                                <div className="py-1 col-md-3 border border-dark">
                                    <i>End Time</i>
                                </div>
                                <div className="py-1 px-1 px-lg-2 px-xl-3 col-md-1 border border-dark">
                                    <i>Station</i>
                                </div>
                                <div className="py-1 col-md-2 border border-dark">
                                    <i>Edit/Del</i>
                                </div>
                            </div>
                            {futureRes.map(res => <ResListRow key={res.id} reservation={res} setChanged={setChanged} />)}
                        </div>

                        <h6 className="my-2 card-subtitle"><b><u>Last 5 Visits</u></b></h6>
                        <div className="col rounded border border-darkinfo">
                            <div className="row">
                                <div className="py-1 col-md-1 border border-dark">
                                    <i>Res. ID</i>
                                </div>
                                <div className="py-1 col-md-2 border border-dark">
                                    <i>Date</i>
                                </div>
                                <div className="py-1 col-md-3 border border-dark">
                                    <i>Start Time</i>
                                </div>
                                <div className="py-1 col-md-3 border border-dark">
                                    <i>End Time</i>
                                </div>
                                <div className="py-1 px-1 px-lg-2 px-xl-3 col-md-1 border border-dark">
                                    <i>Station</i>
                                </div>
                                <div className="py-1 col-md-2 border border-dark">
    
                                </div>
                            </div>
                            {pastRes.map((res, index) => {
                                if(index < 5) {
                                    return <ResListRow key={res.id} reservation={res} setChanged={setChanged} />
                                }
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResList;