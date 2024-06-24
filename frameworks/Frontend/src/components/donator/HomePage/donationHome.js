import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { getAllDonations,} from "../../../api/donator.api";
import { getCookie } from "../../common/getCookie";
import LoadingSpinner from "../../common/LoadingSpinner";
import Footer from "../../Footer";
import NavBar from "../../NavBar";
import DonationHomeCard from "./donationHomeCard";

export default function DonationHome() {
    // State variables initialization
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortFilterDropdownOpen, setSortFilterDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [donationDetails, setDonationDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
    useState(false);

  // Function to handle moving to create a donation
  const movToCreateDonation = (id) => {
    // Alert if the user is not logged in
    if (userId == false) {
      swal({
        title: "אתה לא מחובר",
        text: "התחבר כדי לבקש תרומה",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
         // Redirect to sign in page if confirmed
          navigate("../../user/signin");
        }
      });
    } else {
      // Redirect to create donation page if user is logged in
      navigate("../createDonation");
    }
  };
// Effect hook to set user ID from cookie on component
  useEffect(() => {
    setUserId(getCookie("uId"));
  }, []);

  //fetch all donations 
  useEffect(() => {
    setLoading(true);
    getAllDonations()
      .then((res) => {
        setLoading(false);
        if (res.data.length > 0) {
          setDonation(res.data);
          setDonationDetails(res.data);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, []);

  //update categories array when donation details change
  useEffect(() => {
    const categoriesArray = [];

    donationDetails.forEach((donation) => {
      donation.wantedItems.forEach((item) => {
        if (!categoriesArray.includes(item.item.itemCategory)) {
          categoriesArray.push(item.item.itemCategory);
        }
      });
    });
    setCategories(categoriesArray);
  }, [donationDetails]);

  //update locations array when donation details change
  useEffect(() => {
    const locationsArray = [];

    donationDetails.forEach((donation) => {
      const location = donation.location.split(",")[2].trim();
      if (!locationsArray.includes(location)) {
        locationsArray.push(location);
      }
    });
    setLocations(locationsArray);
  }, [donationDetails]);

  const [loading, setLoading] = useState(false);
  const [donation, setDonation] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

   // Function to filter donations based on selected criteria
  const filterDonations = (donations) => {
    if (sortBy === "closestEndDate") {
      return donations.sort(
        (a, b) => new Date(a.donationEndDate) - new Date(b.donationEndDate)
      );
    } else if (sortBy === "furthestEndDate") {
      return donations.sort(
        (a, b) => new Date(b.donationEndDate) - new Date(a.donationEndDate)
      );
    } else if (sortBy === "oldestCreatedDate") {
      return donations.sort(
        (a, b) => new Date(b.donationStartDate) - new Date(a.donationStartDate)
      );
    } else if (sortBy === "newestCreatedDate") {
      return donations.sort(
        (a, b) => new Date(a.donationStartDate) - new Date(b.donationStartDate)
      );
    } else if (sortBy === "popularity") {
      return donations.sort((a, b) => b.numberOfRequests - a.numberOfRequests);
    } else {
      return donations;
    }
  };

  return (
    <>
      <div className="overflow-hidden" style={{}}>
        <NavBar />
        {loading ? (
          <div className="mt-6 min-vh-100">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="row d-flex justify-content-sm-around mx-5 my-3" dir="rtl">
              {/* Sort dropdown */}
              <div className="col-lg-1 col-md-1 me-4 ">
                <div className={`dropdown ${sortDropdownOpen ? "show" : ""}`}>
                  <button
                    className="btn btn-secondary dropdown-toggle "
                    type="button"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    aria-expanded={sortDropdownOpen}
                  >
                    {" "}
                    מיון{" "}
                  </button>
                  {/* sort options... */}
                  <ul className={`dropdown-menu ${sortDropdownOpen ? "show" : ""}`}>
                    <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)} aria-expanded={sortDropdownOpen}>
                      <button className="dropdown-item" onClick={() => setSortBy("popularity")}>
                        מספר תרומות
                      </button>
                    </li>
                    <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)} aria-expanded={sortDropdownOpen}>
                      <button className="dropdown-item" onClick={() => setSortBy("closestEndDate")}>
                        תאריך סיום קרוב ביותר
                      </button>
                    </li>
                    <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)}  aria-expanded={sortDropdownOpen}>
                      <button className="dropdown-item"  onClick={() => setSortBy("furthestEndDate")}>
                        תאריך סיום רחוק ביותר
                      </button>
                    </li>
                    <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)}  aria-expanded={sortDropdownOpen}>
                      <button  className="dropdown-item" onClick={() => setSortBy("oldestCreatedDate")}>
                        תאריך יצירה רחוק ביותר
                      </button>
                    </li>
                    <li  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}  aria-expanded={sortDropdownOpen}>
                      <button className="dropdown-item"  onClick={() => setSortBy("newestCreatedDate")}>
                        תאריך יצירה קרוב ביותר
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Filter dropdown */}
              <div className="col-lg-2 col-md-2 col-sm-2">
                <div className="dropdown" dir="rtl">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick={() =>
                      setSortFilterDropdownOpen(!sortFilterDropdownOpen)
                    }
                    aria-expanded={sortFilterDropdownOpen}
                  >
                    סינון
                  </button>
                  {/* Filter options */}
                  <ul className={`dropdown-menu ${sortFilterDropdownOpen ? "show" : ""}`}>
                    {/* Category filter */}
                    <li
                      onClick={() => {
                        setSelectedCategory("");
                        setSelectedLocation("");
                        setSortFilterDropdownOpen(!sortFilterDropdownOpen);
                      }}
                    >
                      <button className="dropdown-item">הכל</button>
                    </li>
                    <li className="dropdown-item">
                      <button className="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">
                        סינון לפי קטגוריה{" "}
                      </button>
                      <ul className="dropdown-menu">
                        <li
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedLocation("");
                            setSortFilterDropdownOpen(!sortFilterDropdownOpen);
                          }}
                        >
                          <button className="dropdown-item">הכל</button>
                        </li>
                        {categories.map((category, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSelectedLocation("");
                              setSelectedCategory(category);
                              setSortFilterDropdownOpen(
                                !sortFilterDropdownOpen
                              );
                            }}
                          >
                            <button className="dropdown-item">
                              {category}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                    {/* Location filter */}
                    <li className="dropdown-item">
                      <button className="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">
                        סינון לפי מיקום{" "}
                      </button>
                      <ul className="dropdown-menu">
                        <li
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedLocation("");
                            setSortFilterDropdownOpen(!sortFilterDropdownOpen);
                          }}
                        >
                          <button className="dropdown-item">הכל</button>
                        </li>
                        {locations.map((location, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSelectedCategory("");
                              setSelectedLocation(location);
                              setSortFilterDropdownOpen(
                                !sortFilterDropdownOpen
                              );
                            }}
                          >
                            <button className="dropdown-item">
                              {location}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Search input */}
              <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="input-group input-group-outline bg-white">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="חיפוש"
                    aria-label="Search"
                    onChange={(e) => {
                      setsearchTerm(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* Button to create new donation */}
              <div className="col-lg-3 col-md-3 col-sm-4 ms-2">
                {userId ? (
                  <button className="btn btn-primary" onClick={movToCreateDonation}>
                    בקשה ליצירת תרומה חדשה
                  </button>
                ) : (
                  <Link to={"../../user/signin"}>
                    <button className="btn btn-outline-info">
                      התחבר כדי ליצור תרומה
                    </button>
                  </Link>
                )}
              </div>
            </div>
            
             {/* Displaying donation cards based on filtered and sorted donations */}
            <div dir="rtl" className="row row-cols-4 " style={{marginLeft: 20, marginRight: 20, overflow: "hidden",}}>
              {filterDonations(donationDetails)
                .filter((val) => {
                    if (searchTerm === "") return val;
                    return Object.values(val).some(value =>
                      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    );
                })
                .filter((val) => {
                  if (selectedCategory === "") {
                    return val;
                  } else {
                    return val.wantedItems.some((item) => item.item.itemCategory === selectedCategory);
                  }
                })
                .filter((val) => {
                  if (selectedLocation === "") {
                    return val;
                  } else {
                    return (val.location.split(",")[2].trim() === selectedLocation);
                  }
                })

                .map(function (f) {
                  return (
                    <Link key={f._id} to={"/donator/view/" + f._id}>
                      <DonationHomeCard donation={f} />
                    </Link>
                  );
                })}
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
}
