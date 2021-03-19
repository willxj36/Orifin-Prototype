import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import apiService from '../../utils/apiService';
import { UserContext } from '../components/ContextProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faUserTag, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {

    const history = useHistory();

    const [user,] = useContext(UserContext);

    const [firstName, setFirstName] = useState<string>('');             //states relevant to identifying info
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [password, setPassword] = useState<string>('');               //states relevant to passwords
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [noMatch, setNoMatch] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(false);

    const [btnDisable, setBtnDisable] = useState<boolean>(true);        //disable button if info isn't submittable or when working to avoid multiple submits

    useEffect(() => {
        if (user.userid) {
            history.push('/member-home');
        }
    }, [user]);

    useEffect(() => {
        if(confirmPass !== password) {
            setNoMatch(true);
        } else {
            setNoMatch(false);
        }
    }, [confirmPass, password]);

    useEffect(() => {
        if(firstName && lastName && email && password && confirmPass && !noMatch) {
            setBtnDisable(false);
        } else {
            setBtnDisable(true);
        }
    }, [firstName, lastName, email, password, confirmPass, noMatch]);

    const handleSubmit = async () => {
        setBtnDisable(true);
        try{
            let emailExists = await apiService(`api/users/email/${email}`);
            if(emailExists) {
                alert('Email is already registered');
            } else {
                let res = await apiService('auth/register', 'POST', {
                    firstName,
                    lastName,
                    email,
                    password
                });
                //need more logic here, but need to set up server and DB to do so
                history.push('/member-home');
            }
        } catch(e) {
            console.log(e);
            alert('Something went wrong registering, please try again');
            setBtnDisable(false);
        }
    }

    return (
        <main className="min-vh-100 d-flex bg-deepred pt-5">

            <div className="py-3 mt-5 bg-gold container align-self-start col-md-6 rounded">

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faUserTag} size='2x' />
                    <label htmlFor="firstName" className="ml-2 form-label">First Name</label>
                </div>
                <input onChange={(e) => setFirstName(e.currentTarget.value)} className="mb-4 form-control" type="text" name="firstName" id="firstNameInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faUserTag} size='2x' />
                    <label htmlFor="lastName" className="ml-2 form-label">Last Name</label>
                </div>
                <input onChange={(e) => setLastName(e.currentTarget.value)} className="mb-4 form-control" type="text" name="lastName" id="lastNameInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faEnvelope} size='2x' />
                    <label htmlFor="email" className="ml-2 form-label">Email</label>
                </div>
                <input onChange={(e) => setEmail(e.currentTarget.value)} className="mb-4 form-control" type="email" name="email" id="emailInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faKey} size='2x' />
                    <label htmlFor="password" className="ml-2 form-label">Password</label>
                </div>
                <input onChange={(e) => setPassword(e.currentTarget.value)} className="mb-4 form-control" type={showPass ? 'text' : 'password'} name="password" id="passwordInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faKey} size='2x' />
                    <label htmlFor="confirmPassword" className="ml-2 form-label">Confirm Password</label>
                </div>
                <input onChange={(e) => setConfirmPass(e.currentTarget.value)} className={`mb-2 form-control ${noMatch ? 'border-danger' : null}`} type={showPass ? 'text' : 'password'} name="confirmPassword" id="confirmPasswordInput" />
                
                <div className="row mx-auto mb-2">
                    <FontAwesomeIcon onClick={() => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} size='2x' role='button' />
                    <p className="ml-2">{showPass ? 'Hide' : 'Show'} Passwords</p>
                </div>

                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="px-5 btn btn-lg btn-dark" disabled={btnDisable}>Register</button>
                </div>

            </div>

        </main>
    )
}

export default Register;