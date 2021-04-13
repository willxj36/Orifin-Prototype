import * as React from 'react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { IReservation, IUser } from '../../utils/models';
import apiService from '../../utils/apiService';

interface IUserResEditProps {
    setChanged: Dispatch<SetStateAction<boolean>>,
    changed: boolean
    setResEdit: Dispatch<SetStateAction<IReservation>>,
    resEdit: IReservation,
    userInfo: IUser
}

const UserResEdit: React.FC<IUserResEditProps> = ({ setChanged, changed, setResEdit, resEdit, userInfo }) => {

    const [editTimes, setEditTimes] = useState<string[]>([]);   //array of user-friendly strings representing times that can be selected
    const [prevHours, setPrevHours] = useState<number>(0);      //hour length of res before edit, used to keep user hours and availability up to date
    const [periodEnd, setPeriodEnd] = useState<Date>();         //end of user's current monthly period, used to determine where to credit hours

    const [newStart, setNewStart] = useState<Date>(resEdit.startTime);   //Date object of new start time
    const [newEnd, setNewEnd] = useState<Date>(resEdit.endTime);   //Date object of new end time

    const [monitorCancel, setMonitorCancel] = useState<boolean>(false); //true only if res had one requested, then was canceled
    const [headsetCancel, setHeadsetCancel] = useState<boolean>(false);
    const [submitDisable, setSubmitDisable] = useState<boolean>(true);
    const [reverseTime, setReverseTime] = useState<boolean>(false);

    useEffect(() => {   //checks that something has changed before allowing a submit to save server/db resources from having to deal with a res that didn't actually change
        if(newStart.getTime() !== resEdit.startTime.getTime() || newEnd.getTime() !== resEdit.endTime.getTime() || (resEdit.monitorid && monitorCancel) || (resEdit.headsetid && headsetCancel)) {
            if(newStart.getTime() >= newEnd.getTime()) {
                setSubmitDisable(true);
                setReverseTime(true);
            } else {
                setSubmitDisable(false);
                setReverseTime(false);
            }
        } else {
            setSubmitDisable(true);
            setReverseTime(false);
        }
    }, [newStart, newEnd, monitorCancel, headsetCancel]);

    useEffect(() => {
        if(!userInfo?.membershipStart) return;
        let memberDate: number = new Date(userInfo.membershipStart).getDate();
        let periodEndMonth: number = new Date().getDate() > memberDate ? new Date().getMonth() + 1 : new Date().getMonth();
        let fullDate: Date = new Date(new Date().getFullYear(), periodEndMonth, memberDate);    //date will wrap to next month if memberDate is higher than number of days in periodEndMonth
        setPeriodEnd(fullDate);
    }, [userInfo]);

    useEffect(() => {       //makes user-friendly strings for times to choose from
        if(!resEdit) return;
        let start = resEdit.startTime.getHours();
        let end = resEdit.endTime.getHours();
        setPrevHours(end - start);
        let arr = []
        for(let i = start; i <= end; i++) {
            arr.push(i < 12 ? (i === 0 ? '12:00 AM' : `${i}:00 AM`) : (i === 12 ? `12:00 PM` : `${i - 12}:00 PM`));
        };
        setEditTimes(arr);
    }, [resEdit]);

    const convertStart = (time: string) => {    //essentially opposite of above useEffect; turn user-friendly strings back into usable hour numbers
        let beforeNoon = time.split(' ')[1] === 'AM';
        let hourRaw = Number(time.split(':')[0]);
        let hour = (beforeNoon ? (hourRaw === 12 ? 0 : hourRaw) : (hourRaw === 12 ? 12 : hourRaw + 12));
        let newTime = new Date(resEdit.startTime);    //make a copy of startTime to then change
        newTime.setHours(hour);
        setNewStart(newTime);
    }

    const convertEnd = (time: string) => {
        let beforeNoon = time.split(' ')[1] === 'AM';
        let hourRaw = Number(time.split(':')[0]);
        let hour = (beforeNoon ? (hourRaw === 12 ? 0 : hourRaw) : (hourRaw === 12 ? 12 : hourRaw + 12));
        let newTime = new Date(resEdit.endTime);
        newTime.setHours(hour);
        setNewEnd(newTime);
    }

    const handleSubmit = async () => {
        let newHours: number = newEnd.getHours() - newStart.getHours();
        let hours: number = 0;
        let hoursNext: number = 0;
        if(periodEnd) {
            newStart < periodEnd ? hours = newHours - prevHours : hoursNext = newHours - prevHours;   //will return negative if hours reduced, this is on purpose
        } else {
            hours = newHours - prevHours;
        }
        let response = await apiService(`/api/reservations/${userInfo.id}/${resEdit.id}`, 'PUT', {
            startTime: newStart,
            endTime: newEnd,
            monitorid: (resEdit.monitorid && monitorCancel) ? null : resEdit.monitorid,     //only needs to change if there was one requested and it was canceled
            headsetid: (resEdit.headsetid && headsetCancel) ? null : resEdit.headsetid,
            hours,
            hoursNext
        })
        if(response) {
            alert(response.message);
            setChanged(!changed);
            setResEdit(undefined);
        } else {
            alert('Something went wrong, please try again');
        }
    }

    return (
        <>
            <div className="p-1 d-flex">
                <span onClick={() => setResEdit(undefined)} role="button">
                    <FontAwesomeIcon icon={faArrowCircleLeft} size='2x' />
                    <b className="ml-2">Cancel Edit</b>
                </span>
            </div>
            <div className="mx-auto mb-2 col-lg-4 col-md-6 form">
                <p className="mt-2 mt-md-0"><b>Res ID:</b> {resEdit.id}</p>
                <p><b>Date:</b> {resEdit.startTime.toDateString()}</p>
                <p className="text-darkinfo"><small>To add time outside of current window, please use calendar to make a new reservation to ensure availability. To change station or add equipment, please cancel this reservation, then make a new one.</small></p>
                <label htmlFor="startTime"><b>Start Time:</b></label>
                <select onChange={(e) => convertStart(e.currentTarget.value)} className="form-control" name="startTime" id="startTimeDropdown">
                    {editTimes.map((time, index, arr) => index < arr.length - 1 && <option key={time} value={time}>{time}</option>)}
                </select>
                <small>Current start time: {editTimes[0]}</small><br />
                <label className="mt-2" htmlFor="endTime"><b>End Time:</b></label>
                <select onChange={(e) => convertEnd(e.currentTarget.value)} className="form-control" name="endTime" id="endTimeDropdown">
                    <option value={editTimes[editTimes.length - 1]}>{editTimes[editTimes.length - 1]}</option>
                    {editTimes.map((time, index, arr) => (index > 0 && index !== arr.length - 1) && <option key={time} value={time}>{time}</option>)}
                </select>
                <small>Current end time: {editTimes[editTimes.length - 1]}</small><br />

                {reverseTime && <p className="text-danger">End time must be after start time!</p>}

                {resEdit.monitorid && (
                    <div className="my-2 mx-auto row">
                        <label htmlFor="monitorCancel" className="mt-2"><b>Extra monitor {monitorCancel ? 'canceled' : 'requested'}</b></label>
                        <button onClick={() => setMonitorCancel(!monitorCancel)} className={`ml-auto btn btn-${!monitorCancel ? 'danger' : 'success'}`}>
                            {!monitorCancel ? 'Cancel' : 'Undo'}
                        </button>
                    </div>
                )}

                {resEdit.headsetid && (
                    <div className="my-2 mx-auto row">
                        <label htmlFor="headsetCancel" className="mt-2"><b>Headset {headsetCancel ? 'canceled' : 'requested'}</b></label>
                        <button onClick={() => setHeadsetCancel(!headsetCancel)} className={`ml-auto btn btn-${!headsetCancel ? 'danger' : 'success'}`}>
                            {!headsetCancel ? 'Cancel' : 'Undo'}
                        </button>
                    </div>
                )}

                <button onClick={handleSubmit} className="my-3 btn btn-darkinfo col" disabled={submitDisable}>Submit Changes</button>
            </div>
        </>
    )

}

export default UserResEdit;