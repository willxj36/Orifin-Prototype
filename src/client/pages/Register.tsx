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
    const [passInvalid, setPassInvalid] = useState<boolean>(false);

    const [btnDisable, setBtnDisable] = useState<boolean>(true);        //disable button if info isn't submittable or when working to avoid multiple submits

    useEffect(() => {
        if(user.userid) {      //makes it so that a logged in user can't visit the page, creating token issues if they also submitted a new registration
            history.push('/member-home');
        }
    }, [user]);

    useEffect(() => {
        let passwordReg: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\=])[A-Za-z\d@$!%*?&\=]{8,}$/;
        if(password.match(passwordReg)) {       //checks for standard password security rules
            setPassInvalid(false);
            if(confirmPass !== password) {      //just checks for password confirmation to match first entry
                setNoMatch(true);
            } else {
                setNoMatch(false);
            }
        } else if(password.length > 0) {        //length check prevents password req't popup from displaying before anything has been typed
            setPassInvalid(true);
        }
    }, [confirmPass, password]);

    useEffect(() => {
        if(firstName && lastName && email && password && confirmPass && !noMatch && !passInvalid) {     //ensures submit can only be used if all required fields are filled and passwords match
            setBtnDisable(false);
        } else {
            setBtnDisable(true);
        }
    }, [firstName, lastName, email, password, confirmPass, noMatch, passInvalid]);

    const handleSubmit = async () => {
        setBtnDisable(true);                //disable button to prevent multiple submits
        try{
            let emailReg: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig;     //verify email fits basic standard format; not all-encompassing, should still send validation email if email MUST be valid
            if(!email.match(emailReg)) {
                alert('Please enter a valid email address');
            } else {
                let emailExists = await apiService(`api/users/email/${email}`);
                if(emailExists) {
                    alert('Email is already registered');   //doesn't re-enable submit button until the email field is changed
                } else {
                    let res = await apiService('auth/register', 'POST', {
                        firstName,
                        lastName,
                        email,
                        password
                    });
                    //success or failure logic
                    history.push('/member-home');       //send new user to their "profile page"
                }
            }
        } catch(e) {
            console.log(e);
            alert('Something went wrong registering the account, please try again');
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
                {passInvalid ? (
                    <div className="mt-n4 px-2 position-absolute bg-white rounded border border-danger">
                        <p>Password must contain</p>
                            <ul>
                                <li>At least 8 characters</li>
                                <li>At least 1 capital letter</li>
                                <li>At least 1 lowercase letter</li>
                                <li>At least 1 of the following characters: @, $, !, %, *, ?, &, =</li>
                                <li>No spaces</li>
                            </ul>
                    </div>
                ) : null}

                <div className="mx-auto mb-0 row">
                    <FontAwesomeIcon icon={faKey} size='2x' />
                    <label htmlFor="confirmPassword" className="ml-2 form-label">Confirm Password</label>
                    <FontAwesomeIcon onClick={() => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} size='2x' role='button' className="ml-auto" />
                    <p className="ml-2">{showPass ? 'Hide' : 'Show'} Passwords</p>
                </div>
                <input onChange={(e) => setConfirmPass(e.currentTarget.value)} className={`mb-5 form-control ${noMatch ? 'border-danger' : null}`} type={showPass ? 'text' : 'password'} name="confirmPassword" id="confirmPasswordInput" />

                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="mb-3 px-5 btn btn-lg btn-dark" disabled={btnDisable}>Register</button>
                </div>

            </div>

        </main>
    )
}

export default Register;