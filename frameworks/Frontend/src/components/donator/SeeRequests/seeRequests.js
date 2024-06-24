import React, { useEffect, useState } from "react";
import { useLocation, useParams,useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  
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

  // Fetching donation details
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

// Function to generate PDF report for requests
const generateReport = (requests) => {
  const doc = new jspdf();
  const tableColumn = [
    "שם הבקשן", // Requester Name
    "דואר אלקטרוני", // Requester Email
    "טלפון", // Requester Contact
    "תיאור הבקשה", // Request Description
    "פריטים בבקשה", // Requested Items
  ];
  const tableRows = [];

  // Converting request data into rows for the PDF table
  requests.forEach(request => {
    const requestedItems = request.requestedItems ? request.requestedItems.map(item => item.itemName).join(", ") : "";
    const rowData = [
      request.requesterName,
      request.requesterEmail,
      request.requesterContact,
      request.requestDescription,
      requestedItems,
    ];
    tableRows.push(rowData);
  });

  // Generating the current date string
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
  // Adding image and table to the PDF document
  doc.addImage(img, "PNG", 0, 0, 210, 38);
  // Set text to English and Hebrew
  doc.autoTable(tableColumn, tableRows, {
    startY: 40,
    styles: { cellPadding: 0.5, fontSize: 10, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 'auto' } },
    margin: { top: 40 },
    headerStyles: { fillColor: [51, 122, 183], textColor: [255, 255, 255] },
    bodyStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    // Set text direction to right-to-left (Hebrew)
    hooks: {
      didDrawCell: data => {
        if (typeof data.row.raw[0] === 'string') {
          const textWidth = doc.getStringUnitWidth(data.row.raw[0]) * doc.internal.getFontSize();
          const textHeight = data.row.height;
          const cellWidth = data.cell.width;
          const cellHeight = data.cell.height;
          const xOffset = (cellWidth - textWidth) / 2;
          const yOffset = (cellHeight - textHeight) / 2 + textHeight / 2;
          doc.text(data.row.raw[0], data.cell.x + xOffset, data.cell.y + yOffset, { angle: 180 });
        }
      }
    }
  });
  
  // Saving the PDF with a filename containing donation title and date
  doc.save(`Donations_Requests-${donation.donationTitle}_${dateString}.pdf`);
};


  return (
    <div dir="rtl" style={{ overflow: "hidden" }}>
      <i className="bi bi-arrow-left-circle fs-4 cursor-pointer" onClick={() => navigate(-1)}> הקודם</i>
      <h3 style={{ marginRight: 50, marginTop: 10, marginBottom: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
        בקשות עבור תרומה - {donation.donationTitle}
      </h3>
       {/* Showing a loading spinner while data is being fetched */}
      {loading ? (
        <div style={{ position: "absolute", top: "50%", bottom: 0, left: 0, right: 0, margin: "auto" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
        {donation.status === 'completed'? (
          <> 
             <div className="d-flex justify-content-center">
               {/* Button to generate PDF report */}
            <button className="btn btn-danger" onClick={() => generateReport([...approvedRequests, ...pendingRequests])}>
              יצירת דוח
            </button>
          </div>
          <ul className="nav nav-tabs" role="tablist">
            {/* Tabs for approved requests */}
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
            {/* Button to generate PDF report */}
            <button className="btn btn-danger" onClick={() => generateReport([...approvedRequests, ...pendingRequests])}>
              יצירת דוח
            </button>
          </div>
          {/* Tabs for pending and approved requests */}
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
                <div className="row col-lg-12 col-md-8 col-sm-8 mb-4" style={{ marginLeft: 150, overflow: "hidden" }}>

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
                <div className="row col-lg-12 col-md-8 col-sm-8 mb-4" style={{ marginLeft: 150, overflow: "hidden" }}>
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
