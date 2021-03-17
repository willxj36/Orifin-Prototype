import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

import apiService from '../../utils/apiService';
import { IUser } from '../../utils/models';
import { UserContext } from './ContextProvider';

const Navbar = () => {

    const [user,] = useContext(UserContext);
    const [userFirstName, setUserFirstName] = useState<string>('');

    useEffect(() => {
        if(!user.userid) return;
        (async () => {
            let userInfo: IUser = await apiService(`/api/users/${user.userid}`);
            let firstName = userInfo.firstName;
            setUserFirstName(firstName);
        })()
    }, [user])
    
    const [menu, setMenu] = useState<boolean>(false);

    return(
        <>
            <header className="navbar bg-gold fixed-top">
                <Link to='/'>
                    <h3 className="my-auto text-dark">Logo</h3>
                </Link>
                <h5>Welcome, {userFirstName ? userFirstName : 'guest'}!</h5>
                <div>
                    <FontAwesomeIcon icon={faBars} size="2x" onClick={() => setMenu(!menu)} role="button" className="ml-auto my-auto" />
                
                    {menu ? (
                    <div className="d-flex justify-content-end">
                        <ul className="position-absolute col-xl-2 col-md-4 col-sm-6 mr-n3 list-group">
                            <Link onClick={() => setMenu(false)} to='/'>
                                <li className="list-group-item text-right">Home</li>
                            </Link>

                            {user.userid ? (
                            <Link onClick={() => setMenu(false)} to='/member-home'>
                                <li className="list-group-item text-right">Member Home</li>
                            </Link>
                            ) : (
                            <Link onClick={() => setMenu(false)} to='/login'>
                                <li className="list-group-item text-right">Login</li>
                            </Link>
                            )}

                            <Link onClick={() => setMenu(false)} to='/memberships'>
                                <li className="list-group-item text-right">Memberships</li>
                            </Link>
                            <Link onClick={() => setMenu(false)} to='/calender'>
                                <li className="list-group-item text-right">Calendar</li>
                            </Link> 
                            <Link onClick={() => setMenu(false)} to='/contact-request'>
                                <li className="list-group-item text-right">Contact Request</li>
                            </Link>                
                        </ul>
                    </div>
                    ) : null}
                </div>
            </header>
        </>
    )
}

export default Navbar;