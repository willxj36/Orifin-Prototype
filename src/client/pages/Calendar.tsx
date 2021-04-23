import * as React from 'react';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import ReactCalendar from 'react-calendar';
import TileContent from '../components/TileContent';
import SingleDateTable from '../components/SingleDateTable';

import { IAvailability } from '../../utils/models';
import apiService from '../../utils/apiService';
import { useParams } from 'react-router';

interface ICalendarParams {
    date: string
}

const Calendar = () => {

    const paramDate = useParams<ICalendarParams>().date;

    const [date, setDate] = useState<Date>(new Date());     //sets date to be shown when switching to single date view
    const [showDate, setShowDate] = useState<boolean>(false);   //switches between full month and single date views
    const [availability, setAvailability] = useState<IAvailability[]>();    //loads resAvailability table, not detailed reservations

    useEffect(() => {   
        (async () => {
            let avail: IAvailability[] = await apiService('/api/reservations'); //pulls availability
            avail.forEach(eachDate => eachDate.date = new Date(eachDate.date)); //reconverts dates into Date from string
            setAvailability(avail);
        })();
    }, []);

    useEffect(() => {   //if a date is passed as a parameter (YYYY-MM-DD format), will skip straight to single date view on date specified
        if(paramDate) {
            let [noTime] = paramDate.split('T', 1);     //these 3 lines required to convert string into proper date format
            let dateParts = noTime.split('-');          //new Date(paramDate) adjusts for time zone AFTER setting date, thus gives the day before the desired date
            let date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
            setDate(date);
            setShowDate(true);
        }
    }, [paramDate]);

    const dateClick = (value: any) => { //called when a single date tile is clicked
        setDate(value);
        setShowDate(true);
    }

    return(
        <div className="pt-5 pt-md-0 mt-5 min-vh-100 d-flex justify-content-center align-items-center bg-deepred">
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
                    <div className="col-sm-9 mx-auto mt-5 pt-3">
                        <div className="text-white row justify-content-start">
                            <span className="row" role="button" onClick={() => setShowDate(false)}>
                                <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
                                <p className="my-auto ml-3">Back to month view</p>
                            </span>
                        </div>
                        <div className="row">
                            <h1 className="mx-auto text-center text-white">{date.toDateString()}</h1>
                        </div>
                        <SingleDateTable date={date}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Calendar;