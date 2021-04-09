import * as React from 'react';
import { useEffect } from 'react';

import { IReservation } from '../../utils/models';

interface IResConfirmationProps {
    data: IReservation,
    equipment: {
        monitorFullArr: number[],
        headsetFullArr: number[]
    }
}

const ResConfirmation: React.FC<IResConfirmationProps> = ({ data, equipment }) => {

    if(data) {
        return(
            <div className="bg-gold col-md-9 col-lg-6 rounded border border-light text-center">
                <h1 className="my-4 display-4">Success!</h1>
                <p><b><i>Reservation ID:</i></b> {data.id}</p>
                <p><b><i>Date:</i></b> {data.startTime.toDateString()}</p>
                <p><b><i>Start Time:</i></b> {data.startTime.toTimeString()}</p>
                <p><b><i>End Time:</i></b> {data.endTime.toTimeString()}</p>
                <p><b><i>Station:</i></b> {data.type[0].toUpperCase() + data.type.slice(1)}</p>
    
                {data.monitorid && <p><b>Extra monitor requested</b></p>}
                {data.monitorid > 5 && (
                    <p className="text-danger">
                        Note: Monitor may not be available for hour(s) {equipment.monitorFullArr.map((num, index, arr) => index < arr.length - 1 ? `${num + 1}, ` : num + 1)} of your reservation.
                    </p>
                )}
                {data.headsetid && <p><b>Headset requested</b></p>}
                {data.headsetid > 5 && (
                    <p className="text-danger">
                        Note: Headset may not be available for hour(s) {equipment.headsetFullArr.map((num, index, arr) => index < arr.length - 1 ? `${num + 1}, ` : num + 1)} of your reservation.
                    </p>
                )}
            </div>
        )
    } else {
        return <div className="text-white">One moment...</div> 
    }    

}

export default ResConfirmation;