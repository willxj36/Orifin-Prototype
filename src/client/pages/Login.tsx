import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import apiService from '../../utils/apiService';
import { UserContext } from '../components/ContextProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

    const history = useHistory();

    const [user,] = useContext(UserContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (user.userid) {
            history.push('/member-home');
        }
    }, [user])

    const handleSubmit = async () => {
        let res = await apiService('auth/login', 'POST', {
            email,
            password
        });
        //need more logic here, but need to set up server and DB to do so
    }

    return (
        <main className="min-vh-100 d-flex bg-deepred pt-5">
            <div className="py-3 mt-5 bg-gold container align-self-start col-md-6 rounded">
                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faEnvelope} size='2x' />
                    <label htmlFor="email" className="ml-2 form-label">Email</label>
                </div>
                <input onChange={(e) => setEmail(e.currentTarget.value)} className="mb-4 form-control" type="email" name="email" id="emailInput" />
                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faKey} size='2x' />
                    <label htmlFor="password" className="ml-2 form-label">Password</label>
                </div>
                <input onChange={(e) => setPassword(e.currentTarget.value)} className="mb-4 form-control" type="password" name="password" id="passwordInput" />
                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="px-5 btn btn-lg btn-dark">Log In</button>
                </div>
                <div className="mb-3 mt-4 row justify-content-around">
                    <Link className="btn btn-outline-darkinfo" to="/memberships">Not a member yet? Check out our membership packages!</Link>
                    <p className="my-2">or</p>
                    <Link className="btn btn-outline-darkinfo" to='/register'>Register as a guest</Link>
                </div>
            </div>

        </main>
    )
}

export default Login;