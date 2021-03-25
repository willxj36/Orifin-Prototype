import * as React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {


    return(
        <main className="min-vh-100 d-flex bg-deepred pt-5">
            <div className="container col-11 pt-5">

                <div className="row my-3">
                    <div className="col-md-4 d-flex flex-column">
                        <h1 className="text-white display-4">Welcome to the Arena</h1>
                        <img className="rounded mt-3 flex-shrink-1" src="./img/roman placeholder.jpg" alt="Placeholder Logo" style={{maxWidth: 500}} />
                    </div>
                    <div className="col-md-7 ml-5">
                        <p className="text-white mt-5" style={{fontSize: 30}}><b>Attention getting, informative but brief description of what it is and what it's about</b></p>
                    </div>
                </div>

                <div className="row my-5 py-5">
                    <p className="mx-auto display-2 text-white">Hero banner here</p>
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
                                        <div className="col-6">
                                            <p className="text-dark">Catchy intro to member benefits</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-dark">Maybe an image on this side?</p>
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
                                        <div className="col-6">
                                            <p className="text-dark">Catchy intro to tournament info</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-dark">Probably an image on this side</p>
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

                <div className="bg-gold mt-auto mb-n2 text-center">
                    <p>Links here mostly for legal stuff</p>
                </div>
            </div>
        </main>
    )
}

export default Home;