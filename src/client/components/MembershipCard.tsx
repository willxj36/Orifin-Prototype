import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import apiService from '../../utils/apiService';
import { IMembership } from '../../utils/models';

import { UserContext, IContextUser } from '../components/ContextProvider';

interface IMembershipCardProps {
    membership: IMembership
}

const MembershipCard: React.FC<IMembershipCardProps> = ({ membership }) => {

    const [user, ] = useContext<IContextUser>(UserContext);

    const [currentMember, setCurrentMember] = useState<boolean>(false);
    const [info, setInfo] = useState<string[]>([]);
    const [background, setBackground] = useState<string>('gold');

    useEffect(() => {
        (user.role == membership.id) && setCurrentMember(true);
    }, [user]);

    useEffect(() => {
        (async () => {
            let info = await apiService(`/api/roles/permissions/${membership.id}`);
            setInfo(info);
        })();
        if(membership.role === 'Standard') setBackground('45deg, peru, rosybrown');
        if(membership.role === 'Silver') setBackground('45deg, gray, silver');
        if(membership.role === 'Gold') setBackground('45deg, gold, lightyellow');
        if(membership.role === 'Platinum') setBackground('45deg, gray, white');
        if(membership.role === 'Team') setBackground('45deg, blue, lightblue');
    }, [membership]);

    return(
        <div className="card col-lg-3 col-md-5 mx-4 my-3" style={{background: `${currentMember ? '#DDD8' : `linear-gradient(${background})`}`}}>
            {currentMember && (
                <div className="position-absolute align-self-center my-5 p-2 rounded" style={{background: '#DDD', fontSize: 20}}>
                    Current Membership
                </div>
            )}
            <div className="card-header d-flex justify-content-center">
                <div className="card-title">
                    <h2>{membership.role}</h2>
                </div>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <ul>
                        {info.map(infoPoint => <li key={infoPoint}>{infoPoint}</li>)}
                    </ul>
                </div>
            </div>
            <div className="card-footer d-flex flex-column align-items-center">
                <Link to={!user.userid ? `/register/${membership.id}/monthly` : `/payment/membership/${membership.id}/monthly`}>
                    <button className="my-2 btn btn-primary" disabled={currentMember}>Buy Monthly -- ${membership.monthPrice}</button>
                </Link>
                <Link to={!user.userid ? `/register/${membership.id}/yearly` : `/payment/membership/${membership.id}/yearly`}>
                    <button className="my-2 btn btn-primary" disabled={currentMember}>Buy Full Year -- ${membership.yearPrice}</button>
                </Link>
            </div>
        </div>
    )

}

export default MembershipCard;