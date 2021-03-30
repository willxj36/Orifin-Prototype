import * as React from 'react';
import { useState, useEffect } from 'react';
import apiService from '../../utils/apiService';

import { IReservation } from '../../utils/models';
import TableRow from './TableRow';

interface ISingleDateTableProps {
    date: Date,
}

const SingleDateTable: React.FC<ISingleDateTableProps> = ({ date }) => {

    const [reservations, setReservations] = useState<IReservation[]>(); //all reservations for the day
    const rows = (() => {   //creates all the rows for the reservation table, doing this makes it very easy to change if owners want different business hours put up
        let arr = []
        let i: number;
        for(i = 10; i < 20; i++) {
            arr.push(<TableRow key={i} hour={new Date(date.getFullYear(), date.getMonth(), date.getDate(), i)} reservations={reservations} />)
        }
        return arr;
    })();

    useEffect(() => {       //pull the reservations for just this day
        (async () => {
            let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
            let reservations = await apiService(`/api/reservations/date/${formattedDate}`);
            setReservations(reservations);
        })()
    }, [date])

    return (
        <div className="py-2 mx-n4 mx-md-0 bg-gold rounded text-center">
            <div className="my-3 row justify-content-center">
                <div className="col-2 mx-1"></div>
                <div className="col-2 mx-1">
                    <b>Public</b>
                </div>
                <div className="col-2 mx-1">
                    <b>Private</b>
                </div>
                <div className="col-2 mx-1">
                    <b>Team</b>
                </div>
                <div className="col-2 mx-1">
                    <b>VR</b>
                </div>
            </div>
            {rows}
        </div>
    )

}

export default SingleDateTable;