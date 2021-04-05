import * as React from 'react';
import { useEffect } from 'react';

import { IReservation } from '../../utils/models';

interface IResConfirmationProps {
    data: IReservation
}

const ResConfirmation: React.FC<IResConfirmationProps> = ({ data }) => {

    return(
        <div className="text-white">{data.id}</div>
    )

}

export default ResConfirmation;