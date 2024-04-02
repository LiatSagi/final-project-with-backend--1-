import React, { useEffect, useState } from 'react'
import { getNFunds } from '../../../api/fund.api';
import FundCard from './FundCard';

export default function NewFundraisings({ limit, organizationId }) {
    const [fundraisings, setFundraisings] = useState([]);


    useEffect(() => {
        // get latest 4 fundraisings
        getNFunds(organizationId, limit)
            .then((res) => {
                // console.log(res.data.funds);
                setFundraisings(res.data.funds);
            }).catch((err) => {
                console.log(err);
            })
    }, [organizationId, limit]);
    return (
        <div className="col-12 mt-4" dir="rtl">
            <div className="mb-5 ps-3">
                <h6 className="mb-1">גיוס תרומות</h6>
                {
                    fundraisings.length > 0 ? (
                        <p className="text-sm">גיוסי תרומות חדשים</p>
                    ) : (<p className="text-sm">אין גיוסי תרומות חדשים</p>)
                }

            </div>
            {
                fundraisings.length > 0 ? (
                    <div className="row">
                        {fundraisings.map((fundraising) => (
                            <FundCard key={fundraising._id} fundraising={fundraising} />
                        ))}
                    </div>) : null
            }
        </div>
    )
}
