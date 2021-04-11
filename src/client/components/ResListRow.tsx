import * as React from 'react';

import { IReservation } from '../../utils/models';

interface IResListRowProps {
    reservation: IReservation
}

const ResListRow = ({ reservation }) => {

    return(
        <div className="row">
            List row
        </div>
    )

}

export default ResListRow;