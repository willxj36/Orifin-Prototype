import * as React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faComments, faComment } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../utils/apiService';

const ContactRequest = () => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [resReq, setResReq] = useState<boolean>(false); //indicates whether user has requested a response
    const [btnDisable, setBtnDisable] = useState<boolean>(true); //disables send button if not all required fields are filled in or when processing to avoid multiple send requests

    useEffect(() => { //doesn't allow submission if required fields aren't filled out
        if(resReq) {
            if(!email || !subject || !message) {
                setBtnDisable(true);
            } else {
                setBtnDisable(false);
            }
        } else { //email isn't required if no response is requested
            if(!subject || !message) {
                setBtnDisable(true);
            } else {
                setBtnDisable(false);
            }
        }
    }, [resReq, email, subject, message])

    // const handleSubmit = async () => {
    //     setBtnDisable(true);
    //     !resReq && setEmail('noreply@noreply.com');
    //     try {
    //         let data = {
    //             email,
    //             subject,
    //             text: `Response requested: ${resReq};
    //                 Name: ${name};
    //                 Message: ${message}`
    //         };
    //         let response = await apiService('/api/contact', 'POST', data);
    //         alert(response.message);
    //         setBtnDisable(false);
    //     } catch (e) {
    //         console.log(e);
    //         alert('Email failed to send, please try again');
    //         setBtnDisable(false);
    //     }
    // }

    return(
        <main className="min-vh-100 d-flex bg-deepred pt-5">
            <div className="py-3 mt-sm-5 mt-1 bg-gold container align-self-start col-md-6 rounded">

            <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faComment} size='2x' />
                    <label htmlFor="name" className="ml-2 form-label">Name (optional)</label>
                </div>
                <input onChange={(e) => setName(e.currentTarget.value)} className="mb-4 form-control" type="text" name="name" id="nameInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faEnvelope} size='2x' />
                    <label htmlFor="email" className="ml-2 form-label">Email {resReq ? '(required)' : '(optional)'}</label>
                </div>
                <input onChange={(e) => setEmail(e.currentTarget.value)} className="mb-2 form-control" type="email" name="email" id="emailInput" />
                <div className="mx-auto mb-4 form-check">
                    <input onChange={() => setResReq(!resReq)} checked={resReq} type="checkbox" name="responseRequest" id="resReqCheck" className="form-check-input"/>
                    <label htmlFor="responseRequest" className="form-check-label">Request a response to this message?</label>
                </div>

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faComment} size='2x' />
                    <label htmlFor="subject" className="ml-2 form-label">Subject</label>
                </div>
                <input onChange={(e) => setSubject(e.currentTarget.value)} className="mb-4 form-control" type="text" name="subject" id="subjectInput" />

                <div className="mx-auto mb-2 row">
                    <FontAwesomeIcon icon={faComments} size='2x' />
                    <label htmlFor="message" className="ml-2 form-label">Message</label>
                </div>
                <textarea onChange={(e) => setMessage(e.currentTarget.value)} name="message" id="messageInput" cols={30} rows={10} className="form-control mb-4" />

                <div className="row justify-content-center">
                    <a href={`mailto:willxj36@gmail.com?subject=${subject}&body=${message}`}><button className="px-5 btn btn-lg btn-dark" disabled={btnDisable}>Send</button></a>
                </div>

            </div>
        </main>
    )
}

export default ContactRequest;