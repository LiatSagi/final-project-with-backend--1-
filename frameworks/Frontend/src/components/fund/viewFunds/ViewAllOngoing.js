import React, { useEffect, useState } from "react";
import { getFundByStatus } from "../../../api/fund.api";
import NoItems from "../../common/noItems/noItems";
import ViewFundsCard from "./ViewFundsCard";

export default function ViewAllOngoing() {
  const [showingFunds, setShowingFunds] = useState([]);
  const [ongoingFunds, setOngoingFunds] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Fetch ongoing funds when component mounts
  useEffect(() => {
    try {
      getFundByStatus("approved").then((res) => {
        setOngoingFunds(res.data.funds);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Sort funds based on selected criteria
  useEffect(() => {
    let sortFunds = [...ongoingFunds];
    if (sortBy === "endingDateClosest") {
      sortFunds.sort((a, b) => new Date(a.endingDate) - new Date(b.endingDate));
    } else if (sortBy === "endingDateFurthest") {
      sortFunds.sort((a, b) => new Date(b.endingDate) - new Date(a.endingDate));
    } else if (sortBy === "creationDateFurthest") {
      sortFunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setShowingFunds(sortFunds);
  }, [sortBy, ongoingFunds]);

  // Filter funds based on search term
  useEffect(() => {
    setShowingFunds(
      ongoingFunds.filter(
        (fund) =>
          fund.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fund.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, ongoingFunds]);

  return (
    <>
      {ongoingFunds.length === 0 ? (
        <NoItems message="לא נמצאו בקשות זמינות" />
      ) : (
        <div className="row d-flex my-3" dir="rtl">
          <div className="col-lg-2 col-md-6 col-sm-4 me-7">
            {/* Dropdown for sorting */}
            <div className={`dropdown ${sortDropdownOpen ? "show" : ""}`}>
              <button
                className="btn btn-secondary dropdown-toggle ms-3"
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                aria-expanded={sortDropdownOpen}
              >
                {" "}
                מיון{" "}
              </button>
              <ul className={`dropdown-menu ${sortDropdownOpen ? "show" : ""}`}>
                <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("endingDateClosest")}
                  >
                    תאריך סיום קרוב ביותר
                  </button>
                </li>
                <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("endingDateFurthest")}
                  >
                    תאריך סיום רחוק ביותר
                  </button>
                </li>
                <li onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                  <button
                    className="dropdown-item"
                    onClick={() => setSortBy("creationDateFurthest")}
                  >
                    תאריך יצירה רחוק ביותר
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* Search input */}
          <div className="col-lg-4 col-md-6 col-sm-8">
            <div className="input-group input-group-outline bg-white">
              <input
                id="Search-box"
                className="form-control"
                type="text"
                placeholder="חפש"
                aria-label="Search"
                onChange={(e) => {
                  setsearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {ongoingFunds.length > 0 && showingFunds.length === 0 ? (
        <NoItems message="לא נמצאו תוצאות" />
      ) : (
        <div className="row d-flex justify-content-center mb-4" dir="rtl">
          {showingFunds.map((fund) => (
            <ViewFundsCard key={fund._id} fund={fund} />
          ))}
        </div>
      )}
    </>
  );
}
