import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

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

    useEffect(() => {
        (user.role == membership.id) && setCurrentMember(true);
    }, [user]);

    useEffect(() => {
        console.log(membership);
        (async () => {
            let info = await apiService(`/api/roles/permissions/${membership.id}`);
            setInfo(info);
        })();
    }, [membership]);

    return(
        <div className={`card col-3 mx-4 bg-${currentMember ? 'transparentgray' : 'gold'}`}>
            {currentMember && (
                <div className="position-absolute align-self-center my-5 p-2 rounded" style={{background: '#DDD', fontSize: 20}}>
                    Current Membership
                </div>
            )}
            <div className="card-header">
                <div className="card-title">
                    <h4>{membership.role}</h4>
                </div>
            </div>
            <div className="card-body">
                <div className="card-text">
                    <ul>
                        {info.map(infoPoint => <li key={infoPoint}>{infoPoint}</li>)}
                    </ul>
                </div>
            </div>
            <div className="card-footer">
                <button className="btn btn-primary" disabled={currentMember}>${membership.price}</button>
            </div>
        </div>
    )

}

export default MembershipCard;