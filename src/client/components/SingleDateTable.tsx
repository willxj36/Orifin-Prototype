import * as React from 'react';
import { useState, useEffect } from 'react';
import apiService from '../../utils/apiService';

import { IReservation } from '../../utils/models';
import TableRow from './TableRow';

interface ISingleDateTableProps {
    date: Date,
}

const SingleDateTable: React.FC<ISingleDateTableProps> = ({ date }) => {

    const [reservations, setReservations] = useState<IReservation[]>();
    const rows = (() => {
        let arr = []
        let i: number;
        for(i = 10; i < 20; i++) {
            arr.push(<TableRow key={i} hour={new Date(date.getFullYear(), date.getMonth(), date.getDate(), i)} reservations={reservations} />)
        }
        return arr;
    })();

    useEffect(() => {
        (async () => {
            let formattedDate = `${date.getFullYear()}-${date.getMonth() < 10 ? '0' : null}${date.getMonth() + 1}-${date.getDate()}`;
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