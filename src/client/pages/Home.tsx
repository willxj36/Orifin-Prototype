import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ICountdown {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
}

const Home = () => {

    const [time, setTime] = useState<ICountdown>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });    //time between now and open for countdown

    useEffect(() => {
        let open = new Date(2021, 6, 1).getTime();    //opening date is TBD, this is arbitrarily chosen to show functionality
        setInterval(() => {
            let now: number = Date.now();
            let timeMs: number = open - now;    //milliseconds from now to open
            setTime({
                days: Math.floor(timeMs / (24* 60 * 60 * 1000)),
                hours: Math.floor((timeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
                minutes: Math.floor((timeMs % (60 * 60 * 1000)) / (60 * 1000)),
                seconds: Math.floor((timeMs % (1000 * 60)) / 1000)
            });
        }, 1000);
    }, []);

    return(
        <main className="min-vh-100 d-flex bg-deepred pt-5">
            <div className="container col pt-5">

                <div className="row my-3">
                    <div className="col-md-5 px-5 d-flex flex-column align-items-center">
                        <h1 className="text-light display-4">Welcome to The Ludus</h1>
                        <img className="rounded mt-3 flex-shrink-1" src="./img/roman placeholder.jpg" alt="Placeholder Logo" style={{maxWidth: 500}} />
                    </div>
                    <div className="col-md-7 px-5">
                        <p className="text-light mt-2" style={{fontSize: 25}}>We are a high end Esports hosting facility. We provide top end PC's, consoles, internet connectivity, social environment, and safe professional workspace for professional and serious competitors.</p>
                        <p className="text-light mt-5" style={{fontSize: 25}}>The Ludus is a hosting facility for serious gamers. We provide you top of the line platforms over reliable, stable, high speed internet. We are dedicated to providing you the tools to take your skills to the next level.</p>
                        <p className="text-light mt-5" style={{fontSize: 25}}>You will never be in the middle of a tournament and get nagged to mow the lawn again.</p>
                    </div>
                </div>

                <div className="row justify-content-center my-5">
                    <div className="bg-danger rounded p-1">
                        <Link to='/calendar' className="btn p-3" style={{background: 'linear-gradient(45deg, #FFD766, silver)'}}>
                            <h1 className="text-dark">Reserve Now!</h1>
                        </Link>
                    </div>
                </div>
                
                <div className="row my-5 justify-content-center">
                    <div className="col-lg-5">
                        <Link to='/memberships'>
                            <div className="my-2 card bg-gold">
                                <div className="card-header">
                                    <h1 className="text-darkinfo">Memberships</h1>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <ul className="col-6 list-group">
                                            <li className="text-dark list-group-item bg-transparentgray"><b>Book your time before anyone else!</b></li>
                                            <li className="text-dark list-group-item bg-transparentgray"><b>Show up and skip the line!</b></li>
                                            <li className="text-dark list-group-item bg-transparentgray"><b>Free upgrades, refreshments, and access to the pro lounge!</b></li>
                                        </ul>
                                        <div className="col-6">
                                            <p className="text-dark">Image TBD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-5">
                        <Link to='/tournaments'>
                            <div className="my-2 card bg-gold">
                                <div className="card-header">
                                    <h1 className="text-darkinfo">Tournaments</h1>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <ul className="col-6 list-group">
                                            <li className="text-dark list-group-item bg-transparentgray"><b>Available for tournaments big and small!</b></li>
                                        </ul>
                                        <div className="col-6">
                                            <p className="text-dark">Image TBD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-5">
                        <Link to='/tournaments'>
                            <div className="my-2 card bg-gold">
                                <div className="card-header">
                                    <h1 className="text-darkinfo">More Cards tbd</h1>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <p className="text-dark">Catchy intro to tbd info</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-dark">Probably an image on this side</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                <p className="display-4 text-light text-center">Countdown to Opening Day!</p>
                <div className="mb-5 row">
                    <span className="p-2 rounded display-4 text-light mx-auto bg-dark">{time.days < 10 ? 0 : null}{time.days} : {time.hours < 10 ? 0 : null}{time.hours} : {time.minutes < 10 ? 0 : null}{time.minutes} : {time.seconds < 10 ? 0 : null}{time.seconds}</span>
                </div>

                <div className="bg-gold mt-auto mb-n2 text-center">
                    <p>Links here mostly for legal stuff</p>
                </div>
            </div>
        </main>
    )
}

export default Home;