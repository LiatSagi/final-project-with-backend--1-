import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getOneDonation } from "../../../api/donator.api";
import { newRequest } from "../../../api/donator.api";
import NavBar from "../../NavBar";
import swal from "sweetalert";

export default function SendRequest() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterContact, setRequesterContact] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [donationItems, setDonationItems] = useState([]);

  useEffect(() => {
    getOneDonation(id)
      .then((res) => {
        setDonation(res.data.donation);
        setDonationItems(res.data.donation.wantedItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donation:", error);
        setLoading(false);
      });
  }, [id]);

  const handleItemQuantityChange = (itemId, quantity) => {
    setDonationItems((prevItems) =>
      prevItems.map((item) =>
        item.item._id === itemId ? { ...item, receivedAmount: quantity } : item
      )
    );
  };

  const createRequest = (e) => {
    e.preventDefault();
    const request = {
      donationID: id,
      requesterName,
      requesterEmail,
      requesterContact,
      requestDescription,
      donatedItems: donationItems
      .filter((item) => item.receivedAmount > 0)
      .map(({ wantedQuantity, ...rest }) => rest),
    };
    newRequest(request)
      .then(() => {
        swal("הבקשה נשלחה בהצלחה", "", "success").then(() => {
          // Navigate to dashboard or other appropriate page
        });
      })
      .catch((err) => {
        console.error("Error sending request:", err);
        swal("שליחת הבקשה נכשלה", "בבקשה נסה שוב", "error");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="container my-auto" style={{ paddingTop: 30 }} dir="rtl">
        <div className="row">
          <div className="mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-body">
                <form role="form" className="text-start" onSubmit={createRequest}>
                  <div className="d-flex justify-content-center">
                    <h4>שלח בקשה</h4>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div></div>
                    <div></div>
                    <h6>*שדות חובה</h6>
                  </div>

                  <div className="input-group mb-3 input-group input-group-outline mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="שם מלא*"
                      onChange={(e) => setRequesterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group mb-3 input-group input-group-outline mb-3">
                    <input
                      type="text"
                      placeholder="מספר ליצירת קשר*"
                      className="form-control"
                      onChange={(e) => setRequesterContact(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3 input-group input-group-outline mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email*"
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group mb-3 input-group input-group-outline mb-3">
                    <textarea
                      className="form-control"
                      placeholder="תיאור*"
                      rows="3"
                      onChange={(e) => setRequestDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <h4 className="mb-3">בחר פריטים לתרומה:</h4>
                    <div className="table-responsive ">
                      <table className="table table-bordered table-hover text-center ">
                        <thead className="table-primary ">
                          <tr>
                            <th scope="col">שם הפריט</th>
                            <th scope="col">כמות מבוקשת</th>
                            <th scope="col">בחירת כמות לתרומה</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationItems.map((item) => (
                            <tr className=""  key={item.item._id}>
                              <td>{item.item.itemName}</td>
                              <td>{item.wantedQuantity}</td>
                              <td>
                                <div className="input-group ">
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.wantedQuantity}
                                    value={item.receivedAmount || 0}
                                    onChange={(e) => handleItemQuantityChange(item.item._id, parseInt(e.target.value))}
                                    className="form-control fw-bold fs-6 text-center"
                                  />
                                
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-success">
                      שלח
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
