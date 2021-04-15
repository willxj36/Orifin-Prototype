import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faComments, faComment } from '@fortawesome/free-solid-svg-icons';

import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
import { IUser } from '../../utils/models';

const ContactRequest = () => {

    const [user,] = useContext<IContextUser>(UserContext);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('default@noreply.com'); //pre-fills email with a noreply in case no response is requested and no email is shared
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [resReq, setResReq] = useState<boolean>(false); //indicates whether user has requested a response
    const [emailNote, setEmailNote] = useState<boolean>(false); //shows note about email address
    const [btnDisable, setBtnDisable] = useState<boolean>(true); //disables send button if not all required fields are filled in or when processing to avoid multiple send requests

    useEffect(() => {
        if(user.userid) { //if a user is logged in, auto-sets the email state to the user's email from the DB (email section of form will not appear)
            (async () => {
                let userInfo: IUser = await apiService(`/api/users/id/${user.userid}`);
                let userEmail = userInfo.email;
                let userName = `${userInfo.firstName} ${userInfo.lastName}`;
                setEmail(userEmail);
                setName(userName);
            })()
        }
    }, [user]);
    
    useEffect(() => { //doesn't allow submission if required fields aren't filled out
        if(!email || !subject || !message) {
            setBtnDisable(true);
        } else {
            setBtnDisable(false);
        }
    }, [email, subject, message])

    const handleSubmit = async () => {
        setBtnDisable(true);     //prevent multiple submits
        let emailReg: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig;
        if(!email.match(emailReg)) {
            alert('Please enter a valid email address');
        } else {
            try {
                let data = {
                    email,
                    subject,
                    text: 
                        `Response requested: ${resReq}
                        Name: ${name}
                        Message: ${message}`
                };
                let response = await apiService('/api/contact', 'POST', data);
                alert(response.message);
            } catch (e) {
                console.log(e);
                alert('Email failed to send, please try again');
                setBtnDisable(false);
            }
        }
    }

    return(
        <main className="min-vh-100 d-flex bg-deepred pt-5">
            <div className="py-3 mt-sm-5 mt-1 container bg-gold align-self-start col-md-6 rounded">

                {!user.userid ? (
                    <>
                        <div className="mx-auto mb-2 row">
                            <FontAwesomeIcon icon={faComment} size='2x' />
                            <label htmlFor="name" className="ml-2 form-label">Name (optional)</label>
                        </div>
                        <input onChange={(e) => setName(e.currentTarget.value)} className="mb-4 form-control" type="text" name="name" id="nameInput" />
                        <div className="mx-auto mb-2 row">
                            <FontAwesomeIcon icon={faEnvelope} size='2x' />
                            <label htmlFor="email" className="ml-2 form-label">Email (required)</label>
                        </div>
                        <input onChange={(e) => setEmail(e.currentTarget.value)} className="mb-2 form-control" type="email" name="email" id="emailInput" />
                        
                        <button onClick={() => setEmailNote(!emailNote)} className="btn btn-info p-0 mb-4" style={{fontSize: 14}}>Note on emails</button>
                        {emailNote ? (
                            <div className="mt-n4 mr-3 pt-2 px-2 position-absolute bg-light rounded border border-info">
                                <p>Our 3rd party email service requires a valid email address in order for us to receive messages sent from here even if you don't request a response. 
                                    We're sorry for any inconvenience.</p>
                            </div>
                        ) : null}
                    </>
                ) : null}

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faComment} size='2x' />
                    <label htmlFor="subject" className="ml-2 form-label">Subject</label>
                </div>
                <select onChange={(e) => e.currentTarget.value ? setSubject(e.currentTarget.value) : setSubject(undefined)} className="mb-4 form-control" name="subject" id="subjectInput">
                    <option value="">-- Please choose a subject --</option>
                    <option value="Tournament Info">Tournament Info</option>
                    <option value="General Questions">General Questions</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Website Feedback">Website Feedback</option>
                    <option value="Tech Support">Tech Support</option>
                </select>

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faComments} size='2x' />
                    <label htmlFor="message" className="ml-2 form-label">Message</label>
                </div>
                <textarea onChange={(e) => setMessage(e.currentTarget.value)} name="message" id="messageInput" cols={30} rows={10} className="form-control mb-4" />

                <div className="mx-auto mb-4 form-check">
                    <input onChange={() => setResReq(!resReq)} checked={resReq} type="checkbox" name="responseRequest" id="resReqCheck" className="form-check-input"/>
                    <label htmlFor="responseRequest" className="form-check-label">Request a response to this message?</label>
                </div>

                <div className="row justify-content-center">
                    <button onClick={handleSubmit} className="px-5 btn btn-lg btn-dark" disabled={btnDisable}>Send</button>
                </div>

            </div>
        </main>
    )
}

export default ContactRequest;