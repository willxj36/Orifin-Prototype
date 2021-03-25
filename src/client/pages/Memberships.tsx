import * as React from 'react';
import { useEffect, useState } from 'react';
import apiService from '../../utils/apiService';
import { IMembership } from '../../utils/models';

import MembershipCard from '../components/MembershipCard';

const Memberships = () => {

    const [memberships, setMemberships] = useState<IMembership[]>([]);

    useEffect(() => {
        (async () => {
            let memberships = await apiService('/api/roles');
            setMemberships(memberships);
        })()
    }, [])

    return(
        <div className="min-vh-100 bg-deepred pt-5">
            <div className="d-flex justify-content-center pt-5">
                <div className="row justify-content-center mx-n5">
                    {memberships?.map(membership => {
                        if(membership.id < 90 && membership.id != 1) return <MembershipCard key={membership.id} membership={membership} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default Memberships;