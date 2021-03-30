import * as React from 'react';
import { useState, useEffect } from 'react';

import { IReservation } from '../../utils/models';

interface ITableRowProps {
    hour: Date,
    reservations: IReservation[]
}

const TableRow: React.FC<ITableRowProps> = ({ hour, reservations }) => {

    const [thisHourRes, setThisHourRes] = useState<IReservation[]>();
    const [publicRes, setPublicRes] = useState<IReservation[]>();
    const [privateRes, setPrivateRes] = useState<IReservation[]>();
    const [teamRes, setTeamRes] = useState<IReservation[]>();
    const [vrRes, setVrRes] = useState<IReservation[]>();

    useEffect(() => {
        if(!reservations || !hour) return;
        reservations.forEach(res => {
            res.startTime = new Date(res.startTime);
            res.endTime = new Date(res.endTime);
        })
        let thisHour = reservations.filter(res => res.startTime.getTime() <= hour.getTime() && res.endTime.getTime() > hour.getTime());
        setThisHourRes(thisHour);
    }, [reservations, hour])

    useEffect(() => {
        if(!thisHourRes) return;
        let publicArr = [];
        let privateArr = [];
        let teamArr = [];
        let vrArr = [];
        for(let res of thisHourRes) {
            if(res.type === 'public') publicArr.push(res);
            if(res.type === 'private') privateArr.push(res);
            if(res.type === 'team') teamArr.push(res);
            if(res.type === 'vr') vrArr.push(res);
        }
        setPublicRes(publicArr);
        setPrivateRes(privateArr);
        setTeamRes(teamArr);
        setVrRes(vrArr);
    }, [thisHourRes]);

    return (
        <div className="my-3 row justify-content-center">
            <div className="col-2 mx-1 py-1">
                <b>{hour?.getHours() > 12 ? hour?.getHours() - 12 : hour?.getHours()}{hour?.getHours() < 12 ? 'AM' : 'PM'}</b>
            </div>
            <div className={`col-2 mx-1 py-1 rounded bg-${publicRes?.length < 10 ? 'success' : 'danger'}`}>
                {10 - publicRes?.length}
            </div>
            <div className={`col-2 mx-1 py-1 rounded bg-${privateRes?.length < 5 ? 'success' : 'danger'}`}>
                {5 - privateRes?.length}
            </div>
            <div className={`col-2 mx-1 py-1 rounded bg-${teamRes?.length < 1 ? 'success' : 'danger'}`}>
                {1 - teamRes?.length}
            </div>
            <div className={`col-2 mx-1 py-1 rounded bg-${vrRes?.length < 1 ? 'success' : 'danger'}`}>
                {1 - vrRes?.length}
            </div>
        </div>
    )

}

export default TableRow;