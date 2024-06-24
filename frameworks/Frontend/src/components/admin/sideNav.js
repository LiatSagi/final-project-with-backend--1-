import React from "react";
import "../../assets/css/dashboard.css";
import { Link, useNavigate } from "react-router-dom";

export default function SideNav(props) {
  const navigate = useNavigate();

  // Function to log out the user
  const logOut = (e) => {
    e.preventDefault();
    // Clearing cookies
    document.cookie = "uId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirecting to sign-in page
    navigate("/user/signin");
  };
  return (
    <>
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 9999 ,cursor: "pointer" }}>
        <a
          href="http://localhost:8070/api-docs/#/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", textDecoration: "none" }}
        >
          API Documentation
        </a>
      </div>
      <aside
        dir="rtl"
        className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start me-3 bg-gradient-dark"
        id="sidenav-main"
      >
        <div className="sidenav-header " dir="rtl">
          <i
            className="fas fa-times p-2 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
          ></i>
          <a className="navbar-brand m-0" href="/admin/dashboard">
            <img
              src="/assets/img/logo-ct.png"
              className="navbar-brand-img h-100 ms-2"
              alt="main_logo"
            />
            <span className="ms-1 font-weight-bold text-white">מנהל מערכת</span>
          </a>
        </div>
        <hr className="horizontal light mt-0  mb-1" />
        <div
          className="collapse navbar-collapse w-auto "
          id="sidenav-collapse-main"
        >
          <ul className="navbar-nav">
            {/* Dashboard Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.dashboard ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/dashboard"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">dashboard</i>
                </div>
                <span className="nav-link-text ms-1">ראשי</span>
              </Link>
            </li>
            {/* Organization Requests Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.regorglist ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/regorglist"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">receipt_long</i>
                </div>
                <span className="nav-link-text ms-1">ארגונים</span>
              </Link>
            </li>
            {/* Fundraising Requests Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.regfund ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/regfund"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">
                    volunteer_activism
                  </i>
                </div>
                <span className="nav-link-text ms-1">גיוסי כספים</span>
              </Link>
            </li>
            {/* Accepted Donations Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.accepteddon ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/accepteddon"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">
                    volunteer_activism
                  </i>
                </div>
                <span className="nav-link-text ms-1">תרומות ציוד</span>
              </Link>
            </li>
            {/* Users Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.getusers ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/getusers"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">group</i>
                </div>
                <span className="nav-link-text ms-1">משתמשים</span>
              </Link>
            </li>
            {/* Pending Requests Section */}
            <label> בהמתנה לאישור</label>
            {/* Pending Organizations Requests Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.reqorglist ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/reqorglist"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">receipt_long</i>
                </div>
                <span className="nav-link-text ms-0">ארגונים בהמתנה</span>
              </Link>
            </li>
            {/* Pending Fundraising Requests Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.reqfund ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/reqfund"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">
                    volunteer_activism
                  </i>
                </div>
                <span className="nav-link-text ms-1">גיוסי כספים בהמתנה</span>
              </Link>
            </li>
            {/* Pending Equipment Donations Link */}
            <li className="nav-item">
              <Link
                className={`nav-link text-white ${
                  props.reqdon ? "active bg-gradient-primary" : ""
                }`}
                to="/admin/reqdon"
              >
                <div className="text-white text-center ms-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">
                    volunteer_activism
                  </i>
                </div>
                <span className="nav-link-text ms-1">תרומות ציוד בהמתנה</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidenav-footer position-absolute w-100 bottom-0 ">
          <div className="mx-3">
            <Link
              onClick={logOut}
              className="btn bg-gradient-primary mt-4 w-100"
              to="#"
              type="button"
            >
              התנתק
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
