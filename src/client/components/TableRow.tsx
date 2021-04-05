import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { IReservation } from '../../utils/models';

interface ITableRowProps {
    hour: Date,
    reservations: IReservation[],
}

const TableRow: React.FC<ITableRowProps> = ({ hour, reservations }) => {

    const [thisHourRes, setThisHourRes] = useState<IReservation[]>();   //cleans up full day res into just the res that affect this row's hour
    const [publicRes, setPublicRes] = useState<IReservation[]>([]);     //separates out just res for public seats
    const [privateRes, setPrivateRes] = useState<IReservation[]>([]);   //separates out private
    const [teamRes, setTeamRes] = useState<IReservation[]>([]);         //team res
    const [vrRes, setVrRes] = useState<IReservation[]>([]);             //vr res

    const [disable, setDisable] = useState<boolean>(true);      //starts buttons disabled to prevent people clicking on a reservation button before arrays have loaded if it takes a minute

    useEffect(() => {
        if(!reservations || !hour) return;
        reservations.forEach(res => {   //server converts these into strings, have to turn them back into dates here
            res.startTime = new Date(res.startTime);
            res.endTime = new Date(res.endTime);
        })
        let thisHour = reservations.filter(res => res.startTime.getTime() <= hour.getTime() && res.endTime.getTime() > hour.getTime()); //ignores res that don't affect this row's hour
        setThisHourRes(thisHour);
    }, [reservations, hour])

    useEffect(() => {
        if(!thisHourRes) return;
        let publicArr = [];     //this way we can build the arrays by just going through the res array in order
        let privateArr = [];    //no fullTournament type here because you can't reserve anything if there's a full tourney on a day
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
        setDisable(false);
    }, [thisHourRes]);

    return (
        <div className="my-3 row justify-content-center">
            <div className="col-2 mx-1 py-1">
                <b>{hour?.getHours() > 12 ? hour?.getHours() - 12 : (hour?.getHours() === 0 ? 12 : hour?.getHours())} {hour?.getHours() < 12 ? 'AM' : 'PM'}</b>
            </div>
            <Link to={{
                pathname: `/reservation/public/${hour.getTime()}/${10-publicRes.length}`,
                state: reservations
                }} 
                className="col-2 mx-sm-1 px-1 px-sm-2"
            >
                <button className={`py-1 btn btn-block btn-${publicRes?.length < 10 ? 'success' : 'danger'}`} disabled={!(publicRes?.length < 10) || disable}>
                    {10 - publicRes?.length}
                </button>
            </Link>
            <Link to={{
                pathname: `/reservation/private/${hour.getTime()}/${5-privateRes.length}`,
                state: reservations
                }} 
                className="col-2 mx-sm-1 px-1 px-sm-2"
            >
                <button className={`py-1 btn btn-block btn-${privateRes?.length < 5 ? 'success' : 'danger'}`} disabled={!(privateRes?.length < 5) || disable}>
                    {5 - privateRes?.length}
                </button>
            </Link>
            <Link to={{
                pathname: `/reservation/team/${hour.getTime()}/${1-teamRes.length}`,
                state: reservations
                }} 
                className="col-2 mx-sm-1 px-1 px-sm-2"
            >
                <button className={`py-1 btn btn-block btn-${teamRes?.length < 1 ? 'success' : 'danger'}`} disabled={!(teamRes?.length < 1) || disable}>
                    {1 - teamRes?.length}
                </button>
            </Link>
            <Link to={{
                pathname: `/reservation/vr/${hour.getTime()}/${1-vrRes.length}`,
                state: reservations
                }} 
                className="col-2 mx-sm-1 px-1 px-sm-2"
            >
                <button className={`py-1 btn btn-block btn-${vrRes?.length < 1 ? 'success' : 'danger'}`} disabled={!(vrRes?.length < 1) || disable}>
                    {1 - vrRes?.length}
                </button>
            </Link>
        </div>
    )

}

export default TableRow;