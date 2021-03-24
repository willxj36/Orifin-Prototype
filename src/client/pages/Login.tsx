import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';

import apiService, { SetAccessToken } from '../../utils/apiService';
import { UserContext } from '../components/ContextProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

    const history = useHistory();

    const [user, setUser] = useContext(UserContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPass, setShowPass] = useState<boolean>(false);

    const [btnDisable, setBtnDisable] = useState<boolean>(true);

    useEffect(() => {
        if (user.userid) {
            history.push(`/member-home/${user.userid}`);
        }
    }, [user])

    useEffect(() => {
        if(email && password) {
            setBtnDisable(false);
        } else {
            setBtnDisable(true);
        }
    }, [email, password]);

    const handleSubmit = async () => {
        setBtnDisable(true);
        let res = await apiService('auth/login', 'POST', {
            email,
            password
        });
        if(res) {
            SetAccessToken(res.token, {userid: res.userid, role: res.roleid});
            setUser({userid: res.userid, role: res.roleid});
            history.push(`/member-home/${res.userid}`);
        } else {
            alert('Incorrect email or password, please check credentials and try again');
        }
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
                <div className="row mx-auto justify-content-end">
                    <input onChange={(e) => setPassword(e.currentTarget.value)} className="mb-4 form-control" type={showPass ? 'text' : 'password'} name="password" id="passwordInput" />
                    <FontAwesomeIcon onClick={() => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} size='2x' role='button' className="position-absolute mr-2 mt-1" />
                </div>
                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="px-5 btn btn-lg btn-dark" disabled={btnDisable}>Log In</button>
                </div>
                <div className="mb-3 mt-4 row justify-content-center">
                    <Link className="pt-2 btn btn-outline-darkinfo" to="/memberships">Not a member yet? Check out our membership packages!</Link>
                    <p className="mx-4 mt-2"><b>OR</b></p>
                    <Link className="pt-2 btn btn-outline-darkinfo" to='/register'>Register as a guest</Link>
                </div>
            </div>

        </main>
    )
}

export default Login;