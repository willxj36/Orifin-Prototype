import * as React from 'react';
import { useState, useEffect } from 'react';

import ReactCalendar from 'react-calendar';
import TileContent from '../components/TileContent';
import SingleDateTable from '../components/SingleDateTable';


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
        <div className="pt-5 pt-md-0 min-vh-100 d-flex justify-content-center align-items-center bg-deepred">
            <div className="col">
                <div className={`col-sm-9 col-lg-7 mx-auto rounded ${showDate && 'd-none'}`} style={{background: 'linear-gradient(330deg, #FFD766, silver)'}}>
                    <h3 className="text-center">Click on a date to see details for availability</h3>
                    <p><b>Key:</b></p>
                    <p>Availability for:</p>
                    <div className="row">
                        <div className="row ml-3 mr-1">
                            <div className="mr-1" style={{height: 20, width: 20, borderRadius: 10, backgroundColor: 'blue'}}></div>
                            <p>Public</p>
                        </div>
                        <div className="row ml-3 mr-1">
                            <div className="mr-1" style={{height: 20, width: 20, borderRadius: 10, backgroundColor: 'green'}}></div>
                            <p>Private</p>
                        </div>
                        <div className="row ml-3 mr-1">
                            <div className="mr-1" style={{height: 20, width: 20, borderRadius: 10, backgroundColor: 'red'}}></div>
                            <p>Team</p>
                        </div>
                        <div className="row ml-3 mr-1">
                            <div className="mr-1" style={{height: 20, width: 20, borderRadius: 10, backgroundColor: 'purple'}}></div>
                            <p>VR</p>
                        </div>
                    </div>
                </div>
                <div className={`${showDate && 'd-none'}`} style={{height: 700}}>
                    <ReactCalendar
                        onChange={(value: any) => dateClick(value)}
                        value={date}
                        minDate={new Date()}
                        className="container h-100 rounded"
                        tileContent={(value: any) => <TileContent value={value} availability={availability} />}
                    />
                </div>
                {showDate && (
                    <div className={`col-sm-9 mx-auto ${showDate || 'd-none'}`}>
                        <div className="text-white row justify-content-start">
                            <span className="">icon here</span>
                            <p className="ml-2">Back to month view</p>
                        </div>
                        <div className="row">
                            <h1 onClick={() => setShowDate(false)} className="mx-auto text-center text-white">{date.toDateString()}</h1>
                        </div>
                        <SingleDateTable date={date}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Calendar;