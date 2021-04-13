import * as React from 'react';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { IReservation } from '../../utils/models';
import apiService from '../../utils/apiService';

interface IResListRowProps {
    reservation: IReservation,
    setChanged: Dispatch<SetStateAction<boolean>>,
    setResEdit: Dispatch<SetStateAction<IReservation>>
}

interface ITimes {
    startTime: string,
    endTime: string
}

const ResListRow: React.FC<IResListRowProps> = ({ reservation, setChanged, setResEdit }) => {

    const [times, setTimes] = useState<ITimes>({
        startTime: '',
        endTime: ''
    })

    useEffect(() => {   //string manipulation to make times more user-friendly on front end
        let startArr = reservation.startTime.toTimeString().split(' ', 2);  //returns an array of the time and gmt-(hours based on time zone)
        let startHour = Number(startArr[0].split(':', 1));  //grabs hour number by itself
        let start = startHour < 12 ? `${startHour}:00 AM ${startArr[1]}` : `${startHour - 12}:00 PM ${startArr[1]}`;   //makes string of friendly 12-hour based time w/ timezone info
        let endArr = reservation.endTime.toTimeString().split(' ', 2);
        let endHour = Number(endArr[0].split(':', 1));
        let end = endHour < 12 ? `${endHour}:00 AM ${endArr[1]}` : `${endHour - 12}:00 PM ${endArr[1]}`;
        setTimes({startTime: start, endTime: end});
    }, [reservation]);

    const handleDelete = async () => {
        if(window.confirm('Are you sure you wish to cancel this reservation?')) {
            let hours = reservation.startTime.getHours() - (reservation.endTime.getHours() || 24); //returns negative hours intentionally
            let response = await apiService(`/api/reservations/delete/${reservation.userid}/${reservation.id}`, 'POST', {
                date: `${reservation.startTime.getFullYear()}-${reservation.startTime.getMonth() + 1}-${reservation.startTime.getDate()}`,
                type: reservation.type,
                hours
            }); //token verifies user has permission to change/delete this res on server side
            alert(response.message);
            setChanged(true);   //drills back up to whole page to update reservations in all components after the delete (or edit)
        }
    }

    return (
        <div className="row">
            <div className="py-1 col-md-1 border border-dark">
                {reservation.id}
            </div>
            <div className="py-1 col-md-2 border border-dark">
                {reservation.startTime.toDateString()}
            </div>
            <div className="py-1 col-md-3 border border-dark">
                {times.startTime}
            </div>
            <div className="py-1 col-md-3 border border-dark">
                {times.endTime}
            </div>
            <div className="px-1 px-lg-2 px-xl-3 py-1 col-md-1 border border-dark">
                {reservation.type === 'vr' ? reservation.type.toUpperCase() : reservation.type[0].toUpperCase() + reservation.type.slice(1)}
            </div>
            <div className="py-1 col-md-2 border border-dark d-flex justify-content-around align-items-center">
                {reservation.startTime > new Date() && (    //only allows edit and delete buttons to show for upcoming reservations
                    <>
                        <button className="btn btn-outline-darkinfo">
                            <FontAwesomeIcon onClick={() => setResEdit(reservation)} icon={faEdit} size='lg' />
                        </button>
                        <button className="btn btn-outline-darkinfo">
                            <FontAwesomeIcon onClick={handleDelete} icon={faTrash} size='lg' />
                        </button>
                    </>
                )}
            </div>
        </div>
    )

}

export default ResListRow;