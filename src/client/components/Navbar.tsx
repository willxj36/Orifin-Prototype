import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

import apiService from '../../utils/apiService';
import { IUser } from '../../utils/models';
import { UserContext } from './ContextProvider';

const Navbar = () => {

    const history = useHistory();

    const [user,] = useContext(UserContext);
    const [userFirstName, setUserFirstName] = useState<string>('');

    useEffect(() => {
        if(user.userid) {
            (async () => {
                let userInfo: IUser = await apiService(`/api/users/id/${user.userid}`);
                setUserFirstName(userInfo.firstName);
            })();
        }
    }, [user])
    
    const [menu, setMenu] = useState<boolean>(false);

    const logout = async () => {
        setMenu(false);
        let res = await apiService('/auth/logout');
        if(res) {
            alert('Logout successful');
            history.push('/');
        } else {
            alert('Something went wrong, please try again');
        }
    }

    return(
        <>
            <header className="navbar fixed-top" style={{background: 'linear-gradient(177deg, #FFD766FF, #FFD76688)'}}>
                <Link to='/'>
                    <h3 className="my-auto text-dark">Logo</h3>
                </Link>
                <h5>Welcome, {userFirstName ? userFirstName : 'guest'}!</h5>
                <div>
                    <FontAwesomeIcon icon={faBars} size="2x" onClick={() => setMenu(!menu)} role="button" className="ml-auto my-auto" />
                
                    {menu && (
                    <div className="d-flex justify-content-end">
                        <ul className="position-absolute col-xl-2 col-md-4 col-sm-6 mr-n3 list-group">
                            <Link onClick={() => setMenu(false)} to='/'>
                                <li className="list-group-item text-right text-white bg-dark">Home</li>
                            </Link>

                            {user.userid ? (
                            <Link onClick={() => setMenu(false)} to='/member-home'>
                                <li className="list-group-item text-right text-white bg-dark">Member Home</li>
                            </Link>
                            ) : (
                            <Link onClick={() => setMenu(false)} to='/login'>
                                <li className="list-group-item text-right text-white bg-dark">Login</li>
                            </Link>
                            )}

                            <Link onClick={() => setMenu(false)} to='/memberships'>
                                <li className="list-group-item text-right text-white bg-dark">Memberships</li>
                            </Link>
                            <Link onClick={() => setMenu(false)} to='/calender'>
                                <li className="list-group-item text-right text-white bg-dark">Calendar</li>
                            </Link> 
                            <Link onClick={() => setMenu(false)} to='/contact-request'>
                                <li className="list-group-item text-right text-white bg-dark">Contact Request</li>
                            </Link>

                            {user.userid && <li onClick={logout} className="list-group-item text-right text-white bg-dark" role="button">Logout</li>}

                        </ul>
                    </div>
                    )}
                </div>
            </header>
        </>
    )
}

export default Navbar;