import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getApprovedRequests,
  getOneDonation,
  getRequests,
} from "../../../api/donator.api";
import LoadingSpinner from "../../common/LoadingSpinner";
import NoItems from "../noItems";
import RequestCard from "./requestCard";
import jspdf from "jspdf";
import "jspdf-autotable";
import img from "./banner.png";

export default function SeeRequests() {
  const location = useLocation();
  const fromAccepted = location.state?.fromAccepted;
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [donation, setDonation] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    if (fromAccepted) {
      getApprovedRequests(id)
        .then((res) => {
          setLoading(false);
          if (res.data.length > 0) {
            setApprovedRequests(res.data);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      getRequests(id)
        .then((res) => {
          setLoading(false);
          if (res.data.length > 0) {
            const approved = res.data.filter(request => request.requestStatus === 'accepted');
            const pending = res.data.filter(request => request.requestStatus !== 'accepted');
            setApprovedRequests(approved);
            setPendingRequests(pending);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getOneDonation(id)
      .then((res) => {
        setLoading(false);
        setDonation(res.data.donation);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, []);

  const generateReport = (requests) => {
    const doc = new jspdf();
    const tableColumn = [
      "Requester Name",
      "Requester Email",
      "Requester Contact",
      "Request Description",
      "Requested Items",
    ];
    const tableRows = [];

    requests.forEach(request => {
      const requestedItems = request.requestedItems.map(item => item.itemName).join(", ");
      const rowData = [
        request.requesterName,
        request.requesterEmail,
        request.requesterContact,
        request.requestDescription,
        requestedItems,
      ];
      tableRows.push(rowData);
    });

    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    doc.addImage(img, "PNG", 0, 0, 210, 38);
    doc.autoTable(tableColumn, tableRows, {
      startY: 40,
    });
    doc.save(`Donations_Requests-${donation.donationTitle}_${dateString}.pdf`);
  };

  return (
    <div dir="rtl" style={{ overflow: "hidden" }}>
      <h3 style={{ marginRight: 50, marginTop: 10, marginBottom: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
        בקשות עבור תרומה - {donation.donationTitle}
      </h3>
      {loading ? (
        <div style={{ position: "absolute", top: "50%", bottom: 0, left: 0, right: 0, margin: "auto" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
        {donation.status === 'completed'? (
          <> 
             <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={() => generateReport([...approvedRequests, ...pendingRequests])}>
              יצירת דוח
            </button>
          </div>
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="approved-requests-tab" 
              data-bs-toggle="tab" data-bs-target="#approved-requests" 
              type="button" role="tab" aria-controls="approved-requests" aria-selected="true">
                בקשות שאושרו
              </button>
            </li>
          </ul>
          <div className="tab-content my-3">
            <div className="tab-pane show active" id="approved-requests" role="tabpanel" aria-labelledby="approved-requests-tab">
              {approvedRequests.length === 0 ? (
                <NoItems />
              ) : (
                <div className="row row-cols-2 mb-4" style={{ marginLeft: 150, overflow: "hidden" }}>
                  {approvedRequests.map((request) => (
                    <div key={request._id} className="col">
                      <RequestCard
                        name={request.requesterName}
                        email={request.requesterEmail}
                        contact={request.requesterContact}
                        description={request.requestDescription}
                        id={request._id}
                        accepted={request.requestStatus}
                        title={donation.donationTitle}
                        items={request.items} // Pass requestedItems to RequestCard
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>

          </> 
        ):(
          <> 
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={() => generateReport([...approvedRequests, ...pendingRequests])}>
              יצירת דוח
            </button>
          </div>
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pending-requests-tab" 
              data-bs-toggle="tab" data-bs-target="#pending-requests" 
              type="button" role="tab" aria-controls="pending-requests" aria-selected="true">
                בקשות שלא אושרו עדיין
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="approved-requests-tab" 
              data-bs-toggle="tab" data-bs-target="#approved-requests" 
              type="button" role="tab" aria-controls="approved-requests" aria-selected="false">
                בקשות שאושרו
              </button>
            </li>
          </ul>
          <div className="tab-content my-3">
            <div className="tab-pane" id="approved-requests" role="tabpanel" aria-labelledby="approved-requests-tab">
              {approvedRequests.length === 0 ? (
                <NoItems />
              ) : (
                <div className="row row-cols-2 mb-4" style={{ marginLeft: 150, overflow: "hidden" }}>

                  {approvedRequests.map((request) => (
                    <div key={request._id} className="col">
                      <RequestCard
                        name={request.requesterName}
                        email={request.requesterEmail}
                        contact={"0"+request.requesterContact}
                        description={request.requestDescription}
                        id={request._id}
                        accepted={request.requestStatus}
                        title={donation.donationTitle}
                        items={request.items} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="tab-pane  show active" id="pending-requests" role="tabpanel" aria-labelledby="pending-requests-tab">
              {pendingRequests.length === 0 ? (
                <NoItems />
              ) : (
                <div className="row row-cols-2 mb-4" style={{ marginLeft: 150, overflow: "hidden" }}>
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="col">
                      <RequestCard
                        name={request.requesterName}
                        email={request.requesterEmail}
                        contact={"0"+request.requesterContact}
                        description={request.requestDescription}
                        id={request._id}
                        accepted={request.requestStatus}
                        title={donation.donationTitle}
                        items={request.items} // Pass requestedItems to RequestCard
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
        )}
        </>
      )}
    </div>
  );
}
