import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { IReservation, IUser } from '../../utils/models';
import apiService from '../../utils/apiService';
import { UserContext, IContextUser } from '../components/ContextProvider';
import MemberUserInfo from '../components/MemberUserInfo';
import UserResSummary from '../components/UserResSummary';
import UserResList from '../components/UserResList';

const MemberHome = () => {

    const [user,] = useContext<IContextUser>(UserContext);

    const [reservations, setReservations] = useState<IReservation[]>();
    const [userInfo, setUserInfo] = useState<IUser>();

    const [changed, setChanged] = useState<boolean>(false); //triggers a reload of the reservations if one is edited or deleted; true and false don't actually mean anything here
                                                            //will simply change and back and forth when any change is made to fire the reload either way
    useEffect(() => {
        if(user.userid) {
            (async () => {
                let reservations = await apiService(`/api/reservations/user/${user.userid}`);
                setReservations(reservations);
                let userInfo = await apiService(`/api/users/id/${user.userid}`);
                setUserInfo(userInfo);
            })()
        }
    },  [user, changed])

    return(
        <div className="min-vh-100 bg-deepred">
            <div className="pt-5 container">
                <div className="mt-5 row justify-content-around">
                    <div className="col-lg-4">
                        <MemberUserInfo userInfo={userInfo} />
                    </div>
                    <div className="col-lg-8">
                        <UserResSummary reservations={reservations} userInfo={userInfo} />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <UserResList reservations={reservations} userInfo={userInfo} changed={changed} setChanged={setChanged} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberHome;