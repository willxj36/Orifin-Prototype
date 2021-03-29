import * as React from 'react';
import { useState, useEffect } from 'react';

import ReactCalendar from 'react-calendar';
import TileContent from '../components/TileContent';

import { IAvailability } from '../../utils/models';
import apiService from '../../utils/apiService';

const Calendar = () => {

    const [date, setDate] = useState<Date>(new Date());
    const [showDate, setShowDate] = useState<boolean>(false);
    const [availability, setAvailability] = useState<IAvailability[]>();

    useEffect(() => {
        (async () => {
            let avail: IAvailability[] = await apiService('/api/reservations');
            avail.forEach(eachDate => {
                let [noTime] = eachDate.date.split('T', 1);
                let dateParts = noTime.split('-');
                eachDate.date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            })
            setAvailability(avail);
        })();
    }, []);

    const dateClick = (value: any) => {
        setDate(value);
        setShowDate(true);
    }

    return(
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-deepred">
            <div className="col">
                <p className="display-4 text-white text-center">Calendar under construction, check back later!</p>
                <div className={`${showDate && 'd-none'}`} style={{height: 700}}>
                    <ReactCalendar
                        onChange={(value: any) => dateClick(value)}
                        value={date}
                        minDate={new Date()}
                        className="container h-100 rounded"
                        tileContent={(value: any) => <TileContent date={value} availability={availability} />}
                    />
                </div>
                <div className={`text-white text-center ${showDate || 'd-none'}`}>
                    <h1 onClick={() => setShowDate(false)}>date view {date.toDateString()}</h1>
                </div>
            </div>
        </div>
    )
}

export default Calendar;