import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import apiService, { SetAccessToken } from '../../utils/apiService';
import { UserContext } from '../components/ContextProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faUserTag, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { IMembership } from '../../utils/models';

const Register = () => {

    const membershipId: any = useParams();                              //param is only passed in if coming from memberships page to indicate which membership chosen
    const [membership, setMembership] = useState<IMembership>();

    const history = useHistory();

    const [user, setUser] = useContext(UserContext);

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
            history.push(`/member-home/${user.userid}`);
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

    useEffect(() => {       //uses param to fetch membership info
        (async () => {
            let membership: IMembership = await apiService(`/api/roles/${membershipId.id}`);
            setMembership(membership);
        })()
    }, [membershipId]);

    const handleSubmit = async () => {
        setBtnDisable(true);                //disable button to prevent multiple submits
        try{
            let emailReg: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig;     //verify email fits basic standard format; not all-encompassing, should still send validation email if email MUST be valid
            if(!email.match(emailReg)) {
                alert('Please enter a valid email address');
            } else {
                let emailCheck = await apiService(`/api/users/check-email/${email}`);   //endpoint used only to see if user with this email exists in DB already
                if(emailCheck) {
                    alert('Email is already registered');
                } else {
                    let res = await apiService('/auth/register', 'POST', {
                        firstName,
                        lastName,
                        email,
                        password
                    });
                    if(res) {
                        SetAccessToken(res.token, {userid: res.userid, role: res.roleid});
                        setUser({userid: res.userid, role: res.roleid});
                        if(membershipId) {
                            history.push(`/payment/membership/${membershipId.id}`);    //push new user to the payment page for membership chosen
                            alert(res.message);
                        } else {
                            history.push(`/member-home/${res.userid}`);     //push new user to their new specific member home page if not buying membership
                            alert(res.message);
                        }
                    } else {
                        alert('An error occurred trying to register account. Please try again');
                        setBtnDisable(false);
                    }
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

                {membershipId.id && (
                    <div className="mb-3 text-center bg-gold">
                        <h5>Register your account for your new membership!</h5>
                        <p className="mt-3">Registering for <b><i>{membership?.role} -- ${membership?.price}</i></b></p>
                    </div>
                )}

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
                <div className="row mx-auto justify-content-end">
                    <input onChange={(e) => setPassword(e.currentTarget.value)} className="mb-4 form-control" type={showPass ? 'text' : 'password'} name="password" id="passwordInput" />
                    <FontAwesomeIcon onClick={() => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} size='2x' role='button' className="position-absolute mr-2 mt-1" />
                </div>
                {passInvalid && (
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
                )}

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faKey} size='2x' />
                    <label htmlFor="confirmPassword" className="ml-2 form-label">Confirm Password</label>
                </div>
                <input onChange={(e) => setConfirmPass(e.currentTarget.value)} className={`mb-5 form-control ${noMatch && 'border-danger'}`} type={showPass ? 'text' : 'password'} name="confirmPassword" id="confirmPasswordInput" />

                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="mb-3 px-5 btn btn-lg btn-dark" disabled={btnDisable}>Register</button>
                </div>

            </div>

        </main>
    )
}

export default Register;