import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { UserContext, IContextUser } from '../components/ContextProvider';
import { IUser } from '../../utils/models';
import apiService from '../../utils/apiService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import MemberUserInfo from '../components/MemberUserInfo';

const MemberHome = () => {

    const [user,] = useContext<IContextUser>(UserContext);

    return(
        <div className="min-vh-100 bg-deepred">
            <div className="pt-5 container">
                <div className="mt-5 row justify-content-around">
                    <div className="col-lg-4">
                        <MemberUserInfo user={user} />
                    </div>
                    <div className="col-lg-7">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberHome;