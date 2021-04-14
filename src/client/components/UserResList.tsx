import * as React from 'react';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { IReservation, IUser } from '../../utils/models';
import ResListRow from './ResListRow';
import UserResEdit from './UserResEdit';

interface IUserResListProps {
    userInfo: IUser,
    reservations: IReservation[],
    setChanged: Dispatch<SetStateAction<boolean>>,
    changed: boolean
}

const UserResList: React.FC<IUserResListProps> = ({ userInfo, reservations, setChanged, changed }) => {

    const [futureRes, setFutureRes] = useState<IReservation[]>();   //array of upcoming reservations for user
    const [pastRes, setPastRes] = useState<IReservation[]>();   //array of past reservations with most recent first to facilitate limiting to most recent 5 or other number
    const [resEdit, setResEdit] = useState<IReservation>();     //sets reservation to be edited if edit button is clicked

    useEffect(() => {
        if(!reservations) return;
        let futureRes = reservations.filter(res => res.startTime > new Date()); 
        setFutureRes(futureRes.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
        let pastRes = reservations.filter(res => res.startTime < new Date());
        setPastRes(pastRes.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
    }, [reservations])

    return(
        <div className="mb-2 card rounded bg-gold">
            {userInfo && reservations ? (
                !resEdit ? (
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
                                        <i>Edit/Cancel</i>
                                    </div>
                                </div>
                                {futureRes.map(res => (
                                    <ResListRow key={res.id} reservation={res} setChanged={setChanged} changed={changed} setResEdit={setResEdit} userInfo={userInfo} />
                                ))}
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
                                        return <ResListRow key={res.id} reservation={res} setChanged={setChanged} changed={changed} setResEdit={setResEdit} userInfo={userInfo} />
                                    }
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <UserResEdit setResEdit={setResEdit} resEdit={resEdit} setChanged={setChanged} changed={changed} userInfo={userInfo} />
                )
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResList;