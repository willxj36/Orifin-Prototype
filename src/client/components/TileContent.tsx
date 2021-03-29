import * as React from 'react';
import { useState, useEffect } from 'react';

import { IAvailability } from '../../utils/models';

interface ITileContentProps {
    date: {
        activeStartDate: Date,
        date: Date,
        view: string
    },
    availability: IAvailability[]
}

const TileContent: React.FC<ITileContentProps> = ({ date, availability }) => {

    const [thisDateAvail, setThisDateAvail] = useState<IAvailability>();

    useEffect(() => {
        if(!availability) return;
        if(date.date < new Date() && date.date.getDate() !== new Date().getDate()) return;
        for(let each of availability) {
            if(each.date.getDate() === date.date.getDate() && each.date.getMonth() === date.date.getMonth()) {
                setThisDateAvail(each);
                break;
            }
        };
    }, [date, availability])

    return (
        <>
            <div className="row mr-2">
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.public ? 'blue' : 'transparent'}` }}></div>
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.private ? 'green' : 'transparent'}` }}></div>
            </div>
            <div className="row mr-2">
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.team ? 'red' : 'transparent'}` }}></div>
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.vr ? 'purple' : 'transparent'}` }}></div>
            </div>
        </>
    )

}

export default TileContent;