import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { IReservation, IUser } from '../../utils/models';
import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
import MemberUserInfo from '../components/MemberUserInfo';
import UserResSummary from '../components/UserResSummary';

const MemberHome = () => {

    const [user,] = useContext<IContextUser>(UserContext);

    const [reservations, setReservations] = useState<IReservation[]>();
    const [userInfo, setUserInfo] = useState<IUser>();

    useEffect(() => {
        if(user.userid) {
            (async () => {
                let reservations = await apiService(`/api/reservations/user/${user.userid}`);
                setReservations(reservations);
                let userInfo = await apiService(`/api/users/id/${user.userid}`);
                setUserInfo(userInfo);
            })()
        }
    },  [user])

    return(
        <div className="min-vh-100 bg-deepred">
            <div className="pt-5 container">
                <div className="mt-5 row justify-content-around">
                    <div className="col-lg-4">
                        <MemberUserInfo userInfo={userInfo} />
                    </div>
                    <div className="col-lg-7">
                        <UserResSummary reservations={reservations} userInfo={userInfo} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberHome;