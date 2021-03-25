import * as React from 'react';
import { useState, useEffect } from 'react';

interface ITileContentProps {
    date: {
        activeStartDate: Date,
        date: Date,
        view: string
    }
}

const TileContent: React.FC<ITileContentProps> = ({ date }) => {

    useEffect(() => {
        if (date.date > new Date() || date.date.getDate() === new Date().getDate()) {
            console.log(date.date);
        }
    })

    if (date.date.getDate() === new Date().getDate()) {
        return (
            <div className="row mr-2">
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: 'blue' }}>
                    <p></p>
                </div>
                <div style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: 'green' }}></div>
            </div>
        )
    } else {
        return null;
    }

}

export default TileContent;