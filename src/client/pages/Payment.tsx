import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

interface IPaymentParams {
    product: string,
    id: string,
    period?: string
}

const Payment = () => {

    const params = useParams<IPaymentParams>();

    return(
        <div className="min-vh-100 bg-deepred">
            <div className="container pt-5">
                <div className="row" style={{marginTop: 300}}>
                    <p className="mx-auto display-3 text-white">Payment for {params.product}, id: {params.id}, period: {params.period}</p>
                </div>
                <div className="row">
                    <p className="mx-auto display-4 text-white">(Payment processor coming soon)</p>
                </div>
            </div>
        </div>
    )
}

export default Payment;