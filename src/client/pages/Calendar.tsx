import * as React from 'react';
import { useState, useEffect } from 'react';

import ReactCalendar from 'react-calendar';
import TileContent from '../components/TileContent';

const Calendar = () => {

    const [date, setDate] = useState<Date>(new Date());
    const [showDate, setShowDate] = useState<boolean>(false);

    useEffect(() => {
        console.log();
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
                        tileContent={(value: any) => <TileContent date={value} />}
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