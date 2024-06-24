import React from "react";
import swal from "sweetalert";
import {
  acceptDonationRequest,
  rejectDonationRequest,
} from "../../../api/donator.api";
import { FaWhatsapp } from "react-icons/fa";

export default function RequestCard(props) {
  // Data object for request
  var reqdata = {
    email: props.email,
    title: props.title,
  };

  // Function to handle accepting a request
  const acceptRequest = (id) => {
    swal({
      title: "אתה בטוח?",
      text: "הבקשה תאושר",
      icon: "warning",
      textDirection: "rtl",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        acceptDonationRequest(id, reqdata)
          .then((res) => {
            // Send request to accept the donation
            if (willDelete) {
              swal("הבקשה אושרה!!", {
                icon: "success",
              });
              // Reload the page after accepting request
              setTimeout(function () {
                window.location.reload();
              }, 1000);
              console.log(res);
            }
          })
          .catch((e) => {
            // Show error message if accepting the request fails
            swal("File Is Not Deleted");
          });
      }
    });
  };

  // Function to handle rejecting a request
  const rejectedRequest = (id) => {
    var reqdata = {
      email: props.email,
      title: props.title,
    };
    swal({
      title: "אתה בטוח?",
      text: "הבקשה תדחה",
      icon: "warning",
      textDirection: "rtl",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        rejectDonationRequest(id, reqdata)
          .then((res) => {
            if (willDelete) {
              // Show success message
              swal("הבקשה נדחתה!!", {
                icon: "success",
              });
              // Reload the page after accepting request
              setTimeout(function () {
                window.location.reload();
              }, 1000);
              console.log(res);
            }
          })
          .catch((e) => {
            // Show error message if rejecting the request fails
            swal("File Is Not Deleted");
          });
      }
    });
  };
  return (
    <>
      <div className="card-container ">
        <div
          className=" course card d-flex "
          style={{
            width: 500,
            height: "92%",
            maxHeight: 500,
            marginBottom: 20,
            marginRight: 20,
          }}
        >
          <div className="card-body ">
            <h4 style={{ textAlign: "center", marginBottom: 20 }}>
              פרטי הבקשה
            </h4>
            {/* Displaying requester information */}
            <div style={{ marginRight: 40 }}>
              <h6>שם - {props.name}</h6>
              <h6>Email - {props.email}</h6>
              <h6>
                מספר איש קשר - {props.contact}
                {/* WhatsApp button for contacting requester */}
                <a
                  href={`https://wa.me/972${
                    props.contact
                  }?text=${encodeURIComponent(
                    "שלום, ראיתי את התרומה שלך דרך אתר Instant Giving ואני מעוניין בתרומה שהצעת! אשמח שתיצור איתי קשר. תודה רבה!"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success p-2 me-2 mt-2"
                >
                  <FaWhatsapp className="ms-2 mb-1" /> שלח הודעה ב whatsapp
                </a>
              </h6>

              <h6>תיאור - {props.description}</h6>
              {/* Displaying donation items */}
              {props.items.length > 0 && <h6>פריטים לתרומה:</h6>}
              <ul className="list-group">
                {props.items.map((items, index) => (
                  <li className="" key={index}>
                    <span>שם הפריט: {items.item.itemName}</span>
                    <span className="badge bg-light text-dark fs-7 me-3 m-1">
                      כמות: {items.receivedAmount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Buttons for accepting/rejecting request */}
            {props.accepted === "accepted" ? (
              <div
                className="d-flex justify-content-around"
                style={{ marginTop: 20 }}
              ></div>
            ) : (
              <div
                className="d-flex justify-content-around"
                style={{ marginTop: 20 }}
              >
                {/* Button to accept request */}
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    acceptRequest(props.id, props.email, props.title);
                  }}
                >
                  אשר בקשה
                </button>
                {/* Button to reject request */}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    rejectedRequest(props.id, props.email);
                  }}
                >
                  דחה בקשה
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
