import * as React from 'react';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';

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
    const [resEdit, setResEdit] = useState<IReservation>();     //sets reservation to be edited if edit button is clicked
    const [editTimes, setEditTimes] = useState<string[]>([]);

    useEffect(() => {
        if(!reservations) return;
        let futureRes = reservations.filter(res => res.startTime > new Date()); 
        setFutureRes(futureRes.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
        let pastRes = reservations.filter(res => res.startTime < new Date());
        setPastRes(pastRes.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
    }, [reservations])

    useEffect(() => {
        if(!resEdit) return;
        let start = resEdit.startTime.getHours();
        let end = resEdit.endTime.getHours();
        let arr = []
        for(let i = start; i <= end; i++) {
            arr.push(i < 12 ? (i === 0 ? '12:00 AM' : `${i}:00 AM`) : (i === 12 ? `12:00 PM` : `${i - 12}:00 PM`));
        };
        setEditTimes(arr);
    }, [resEdit]);

    return(
        <div className="card rounded bg-gold">
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
                                {futureRes.map(res => <ResListRow key={res.id} reservation={res} setChanged={setChanged} setResEdit={setResEdit} />)}
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
                                        return <ResListRow key={res.id} reservation={res} setChanged={setChanged} setResEdit={setResEdit} />
                                    }
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="d-flex">
                            <span onClick={() => setResEdit(undefined)} role="button">
                                <FontAwesomeIcon icon={faArrowCircleLeft} size='2x' />
                                <b className="ml-2">Cancel Edit</b>
                            </span>
                        </div>
                        <div className="form">
                            <p><b>Res ID:</b> {resEdit.id}</p>
                            <p><b>Date:</b> {resEdit.startTime.toDateString()}</p>
                            <label htmlFor="startTime"><b>Start Time</b></label>
                            <select name="startTime" id="startTimeDropdown">
                                {editTimes.map(time => <option value={time}>{time}</option>) /*pick up here, need to still stop end time from being included */}
                            </select>
                        </div>
                    </>
                )
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default UserResList;