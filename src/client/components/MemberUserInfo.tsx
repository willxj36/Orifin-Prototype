import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { IUser, IUserLocal } from '../../utils/models';
import apiService from '../../utils/apiService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface IMemberUserInfoProps {
    userInfo: IUser
}

const MemberUserInfo: React.FC<IMemberUserInfoProps> = ({ userInfo }) => {

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [userEdit, setUserEdit] = useState<boolean>(false);         //edit process goes through a couple screens, these states navigate through them
    const [passwordEntry, setPasswordEntry] = useState<boolean>(false);
    const [showPass, setShowPass] = useState<boolean>(false);       //show password in plain text
    const [btnInfoDisable, setBtnInfoDisable] = useState<boolean>(true);
    const [btnPassDisable, setBtnPassDisable] = useState<boolean>(true);
    const [changed, setChanged] = useState<boolean>(false);     //becomes true after an edit, causes a reload of userInfo to reflect updates on component

    useEffect(() => {   //ensures info can't be submitted with a blank input which would cause server error
        if(firstName && lastName && email) setBtnInfoDisable(false);
    }, [firstName, lastName, email]);

    useEffect(() => {
        if(password) setBtnPassDisable(false);
    }, [password]);

    useEffect(() => {   //sets states for edit values to current values
        if(!userEdit) return;   //stops states from being set if no editing going on, also prevents an error when page first loads
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setEmail(userInfo.email);
    }, [userEdit])

    const handleSubmit = async () => {
        setBtnPassDisable(true);    //prevent multiple submits
        let verify = await apiService('/auth/verify', 'POST', {     //route simply verifies password
            email: userInfo.email,
            password
        });
        if(verify) {
            let response = await apiService(`/api/users/${userInfo.id}`, 'PUT', {   //sends request to update db
                firstName,
                lastName,
                email
            });
            if(response) {
                alert(response.message);
                setChanged(true);   //causes reload of userInfo
                setUserEdit(false); //pushes card back to non-edit display
                setPasswordEntry(false);    //resets state so if user attempts to edit again, it doesn't skip the input screen
            } else {
                alert('Something went wrong, please try again');
                setPasswordEntry(false);    //this only happens if something goes wrong on server side, so it only sets client back one screen so they can try again
            }
        } else {
            alert('Password is incorrect, please try again');
        }
    }

    return (
        <div className="card bg-gold rounded">
            {userInfo ? (
                <>
                    <div className="card-header">
                        <div className="card-title">
                            <h5><b>User Info</b></h5>
                        </div>
                    </div>

                    <div className="card-body">
                        {!userEdit ? (
                            <>
                                <p><b><i>Name:</i></b> {userInfo.firstName} {userInfo.lastName}</p>
                                <p><b><i>Email address:</i></b> {userInfo.email}</p>
                                <p>
                                    <b><i>Membership:</i></b> {userInfo.role[0].toUpperCase() + userInfo.role.slice(1)}
                                    <Link to="/memberships" className="ml-2"><b><i>Upgrade!</i></b></Link>
                                </p>
                                <p><b><i>Joined:</i></b> {new Date(userInfo._created).toDateString()}</p>
                                <p><b><i>Membership Start:</i></b> {userInfo.membershipStart ? new Date(userInfo.membershipStart).toDateString() : 'Not a member yet!'}</p>
                            </>
                        ) : (!passwordEntry ? (
                            <div className="form">
                                <label htmlFor="firstNameInput" className="form-label">First Name</label>
                                <input 
                                    onChange={(e) => setFirstName(e.currentTarget.value)} 
                                    type="text" name="firstNameInput" id="firstNameInput" 
                                    className="mb-3 form-control"
                                    defaultValue={userInfo.firstName}
                                />
                                <label htmlFor="lastNameInput" className="form-label">Last Name</label>
                                <input 
                                    onChange={(e) => setLastName(e.currentTarget.value)}
                                    type="text" name="lastNameInput" id="lastNameInput" 
                                    className="mb-3 form-control"
                                    defaultValue={userInfo.lastName}
                                />
                                <label htmlFor="emailInput" className="form-label">Email Address</label>
                                <input 
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                    type="email" name="emailInput" id="emailInput"
                                    className="mb-3 form-control"
                                    defaultValue={userInfo.email}
                                />
                                <button onClick={() => setPasswordEntry(true)} className="btn btn-outline-darkinfo" disabled={btnInfoDisable}>Submit Changes</button>
                            </div>
                        ) : (
                            <div className="form">
                                <p>Please enter your password again to submit new info</p>
                                <div className="row mx-auto justify-content-end">
                                    <input onChange={(e) => setPassword(e.currentTarget.value)} className="mb-4 form-control" type={showPass ? 'text' : 'password'} name="password" id="passwordInput" />
                                    <FontAwesomeIcon onClick={() => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} size='2x' role='button' className="position-absolute mr-2 mt-1" />
                                </div>
                                <button onClick={handleSubmit} className="btn btn-outline-darkinfo" disabled={btnPassDisable}>Verify</button>
                            </div>
                        ))}

                        {!userEdit ? (
                            <div className="card-footer">
                                <button onClick={() => setUserEdit(true)} className="btn btn-outline-darkinfo"><FontAwesomeIcon icon={faEdit} size='2x' /></button>
                            </div>
                        ) : null}

                    </div>
                </>
            ) : (
                <FontAwesomeIcon icon={faSpinner} size='4x' className="mx-auto my-5" />
            )}
        </div>
    )

}

export default MemberUserInfo;