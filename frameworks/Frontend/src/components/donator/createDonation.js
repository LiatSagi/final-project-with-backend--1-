import React, { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { newDonation } from "../../api/donator.api";
import NavBar from "../NavBar";
import { requesterProfile } from "../../api/requester.api";
import LoadingSpinner from "../common/LoadingSpinner";
import { getCookie } from "../common/getCookie";
import Footer from "../Footer";
import { initializeMap } from "./mapHandler";

export default function CreateDonation() {
  // Get today's date
  var dtToday = new Date();

  // Calculate tomorrow's date
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate() + 1;
  var year = dtToday.getFullYear();
  var Nextyear = dtToday.getFullYear() + 1;

  // Ensure leading zeros for month and day
  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();

  // Calculate min and max dates for donation end date
  var minDate = year + "-" + month + "-" + day;
  var maxDate = Nextyear + "-" + month + "-" + day;

  // Array of categories for donation items
  const categories = [
    "כלי עבודה",
    "ציוד רפואי",
    "אלקטרוניקה",
    "ציוד ספורט",
    "בגדים",
    "ציוד משרדי",
    "אחר",
  ];

  // React state hooks
  const navigate = useNavigate();
  const [donationTitle, setDonationTitle] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [donationDescription, setDonationDescription] = useState("");
  const [donationEndDate, setDonationEndDate] = useState("");
  const [donationImage, setDonationImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const [wantedItems, setWantedItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wantedQuantity, setWantedQuantity] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  // Fetch user details when user ID changes
  useEffect(() => {
    setUserId(getCookie("uId"));
  }, []);

  useEffect(() => {
    if (userId) {
    console.log("Fetching user details for user ID:", userId); // Check if the user ID is updated
    requesterProfile(userId)
      .then((res) => {
        console.log("User details:", res.data); // Check if user details are retrieved correctly
        setEmail(res.data.requester.email);
        setContactNumber("0" + res.data.requester.contactNumber);
      })
      .catch((error) => {
        console.error("Failed to fetch user details:", error);
      });
    }
  }, [userId]);

  // Handle file upload
  const fileUpload = (files) => {
    setDonationImage(files.base64);

  };

  useEffect(() => {
    if (!mapInitialized) {
      const map = initializeMap(setLocation, setMapInitialized);
      setMapInitialized(true);
    }
  }, [mapInitialized]);

  const handleAddItem = () => {
    // Validate input fields
    if (!itemName || !selectedCategory || !wantedQuantity) {
      alert("Please fill all fields");
      return;
    }

    // Create a new item object
    const newItem = {
      itemName: itemName,
      category: selectedCategory,
      quantity: wantedQuantity,
    };

    // Add the new item to the array of wanted items
    setWantedItems((prevItems) => [...prevItems, newItem]);

    // Clear input fields
    setItemName("");
    setSelectedCategory("");
    setWantedQuantity("");
  };

  // Handle donation creation
  const createDonation = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!submitButtonClicked) {
      return;
    }
    if (wantedItems.length === 0) {
      alert("אנא הוסף פריט לפני הגשת הבקשה");
      return;
    }

    setLoading(true);
    console.log(donationImage);
    const userID = userId;

    const donation = {
      userID,
      donationTitle,
      email,
      location,
      donationEndDate,
      contactNumber,
      donationImage,
      donationDescription,
      wantedItems,
    };
    console.log(donation);
    await newDonation(donation)
      .then((res) => {
        setLoading(false);
        swal("תרומה נוצרה בהצלחה", "", "success").then((value) => {
          if (value) {
            navigate("../dashboard");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        swal("יצירת התרומה נכשלה", "בבקשה נסה שוב", "error").then((value) => {
          if (value) {
            navigate("../dashboard");
          }
        });
      });
  };

  // Delete an item from the list of wanted items
  const handleDeleteItem = (index) => {
    const updatedItems = [...wantedItems];
    updatedItems.splice(index, 1);
    setWantedItems(updatedItems);
  };

  // Edit an item from the list of wanted items
  const handleEditItem = (index) => {
    const editedItem = wantedItems[index];

    // Set the values of the input fields to the values of the edited item
    setItemName(editedItem.itemName);
    setSelectedCategory(editedItem.category);
    setWantedQuantity(editedItem.quantity);

    // Remove the edited item from the list of wanted items
    const updatedItems = wantedItems.filter((item, i) => i !== index);
    setWantedItems(updatedItems);
  };

  return (
    <>
      <NavBar />
      {loading ? (
        // Show loading spinner while loading
        <div style={{ position: "absolute", top: "50%", bottom: 0, left: 0, right: 0, margin: "auto",}}>
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className="container my-auto"
          style={{ paddingTop: 30, marginBottom: 100 }}
        >
          <div className="row" dir="rtl">
            <div className="mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom">
                <div className="card-body">
                  <form
                    role="form"
                    className="text-start"
                    onSubmit={createDonation}
                  >
                    <div className="d-flex justify-content-center">
                      <h4>צור את הבקשה לתרומה שלך</h4>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div></div>
                      <h6>*שדות חובה</h6>
                    </div>

                    <div className="input-group mb-3 input-group input-group-outline mb-3">
                      <input
                        type="text"
                        maxLength={35}
                        className="form-control"
                        placeholder="כותרת*"
                        title="כותרת חייבת לכלול לפוחת 5 תווים "
                        minLength={5}
                        aria-label="Donation Title"
                        aria-describedby="basic-addon1"
                        onChange={(e) => {
                          setDonationTitle(e.target.value);
                        }}
                        required
                      />
                    </div>
               
                    <div className="input-group input-group mb-3 input-group-outline mb-2">
                      <input
                        type="text"
                        maxLength={100}
                        className="form-control"
                        placeholder="מיקום*"
                        aria-label="Location"
                        aria-describedby="basic-addon1"
                        value={location}
                        readOnly
                        required
                      />
                    </div>

                    <div id="map" style={{ height: "300px" }}></div>
                    <p className="fs-6 m-0">
                      לחץ על המפה כדי להוסיף מיקום או השתמש בחיפוש למציאת כתובת.
                    </p>
                    <p className="fs-7 text-danger p-0 m-0">
                      *לא ניתן להכניס כתובת מדויקת כדי לשמור על פרטיותכם (אנחנו
                      ממליצים לבחור את מיקום ע"י לחיצה על האזור הרלוונטי במפה)
                    </p>

                    <label className="my-3">פרטי איש קשר:</label>

                    <div className="input-group  input-group input-group-outline mb-3">
                      <input
                        type="text"
                        placeholder="מספר טלפון של איש קשר*"
                        aria-label="Contact Number"
                        aria-describedby="basic-addon1"
                        title="מספר טלפון בעל 10 ספרות"
                        pattern="[0]{1}[5]{1}[0-9]{8}"
                        className="form-control"
                        value={contactNumber}
                        onChange={(e) => {
                          setContactNumber(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="input-group input-group input-group-outline ">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email*"
                        aria-label="Email"
                        aria-describedby="basic-addon1"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <label className="my-3">תאריך סיום התרומה:</label>
                    <div className="input-group input-group input-group-outline mb-3">
                      <input
                        placeholder="תאריך סיום התרומה"
                        className="form-control"
                        type="date"
                        min={minDate}
                        max={maxDate}
                        id="datefield"
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => {
                          setDonationEndDate(e.target.value);
                        }}
                        required
                      />
                    </div>

                    <label className="">הוספת פריטים:</label>
                    <div className="input-group input-group-outline align-items-center">
                      <select
                        className="form-select ms-2 rounded-2"
                        aria-label="Select Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">בחר קטגוריה</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-control ms-2 rounded-2"
                        placeholder="שם הפריט"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                      />

                      <input
                        type="number"
                        className="form-control ms-2 rounded-2"
                        placeholder="כמות מבוקשת"
                        value={wantedQuantity}
                        onChange={(e) => setWantedQuantity(e.target.value)}
                      />
                      <button
                        className="btn btn-primary rounded-start me-2 mt-2"
                        onClick={handleAddItem}
                      >
                        <i
                          className="fas fa-plus"
                          style={{ marginLeft: "5px" }}
                        ></i>
                        הוסף
                      </button>
                    </div>
                    <div>
                      {wantedItems.length > 0 && (
                        <div>
                          <h4>הפריטים המבוקשים:</h4>
                          <ul>
                            <table className="table  table-hover text-center">
                              <thead className="table-primary ">
                                <tr>
                                  <th scope="col">קטגוריה</th>
                                  <th scope="col">שם הפריט</th>
                                  <th scope="col">כמות</th>
                                  <th scope="col">פעולות</th>
                                </tr>
                              </thead>
                              <tbody>
                                {wantedItems.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.category}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                      <button
                                        className="btn btn p-0 ms-5"
                                        onClick={() => handleEditItem(index)}
                                      >
                                        <i className="fas fa-edit text-info fs-5"></i>
                                      </button>
                                      <button
                                        className="btn p-0"
                                        onClick={() => handleDeleteItem(index)}
                                      >
                                        <i className="bi bi-trash text-danger fs-5"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="input-group mb-3 input-group input-group-outline mb-3">
                      <textarea
                        className="form-control"
                        placeholder="תיאור אודות התרומה*"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        onChange={(e) => {
                          setDonationDescription(e.target.value);
                        }}
                        required
                      ></textarea>
                    </div>
                    <div>הוספת תמונה</div>
                      <FileBase64 onDone={(files) => fileUpload(files)} />
                    <div className="text-center">
                      {wantedItems.length > 0 && (
                        <button type="submit" className="btn btn-secondary" onClick={() => setSubmitButtonClicked(true)}>
                         יצירת בקשה לתרומה
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: 100,
        }}
      >
        <Footer />
      </div>
    </>
  );
}
