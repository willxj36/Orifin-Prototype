import * as React from 'react';
import { useState, useEffect } from 'react';

import { IAvailability } from '../../utils/models';

interface ITileContentProps {
    value: {
        activeStartDate: Date,
        date: Date,
        view: string
    },
    availability: IAvailability[]
}

const TileContent: React.FC<ITileContentProps> = ({ value, availability }) => {

    const [thisDateAvail, setThisDateAvail] = useState<IAvailability>();

    useEffect(() => {
        if(!availability || !value) return;
        if(value.date < new Date() && value.date.getDate() !== new Date().getDate()) return;
        for(let each of availability) {
            if(each.date.getDate() === value.date.getDate() && each.date.getMonth() === value.date.getMonth()) {
                setThisDateAvail(each);
                break;
            }
        };
    }, [value, availability])

    if(thisDateAvail) {
        return(
            <>
                <div className="row mr-sm-1 pr-2 my-sm-1">
                    <div className="mx-sm-1" style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.public ? 'blue' : 'transparent'}` }}></div>
                    <div className="mx-sm-1" style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.private ? 'green' : 'transparent'}` }}></div>
                </div>
                <div className="row mr-sm-1 pr-2 my-sm-1">
                    <div className="mx-sm-1" style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.team ? 'red' : 'transparent'}` }}></div>
                    <div className="mx-sm-1" style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: `${thisDateAvail?.vr ? 'purple' : 'transparent'}` }}></div>
                </div>
            </>
        )
    } else return null;

}

export default TileContent;