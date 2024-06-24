import axios from "../../api/axios";
import React, { useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import "./footer.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CHANGE_PASSWORD_URL = "/login/changePassword";

export default function ChangePassword() {
  // Initialize navigation
  const Navigate = useNavigate();
  const { token } = useParams();
  // State variables for password, confirm password, loading state, error and success message
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send POST request to change password
      const response = await axios.post(
        CHANGE_PASSWORD_URL,
        JSON.stringify({ token, password, confirmPassword }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // Display success message
      setSuccessMsg("הסיסמה שונתה בהצלחה.");
      // Navigate to sign-in page and close the tab after 1 second
      setTimeout(() => {
        Navigate("/user/signin");
        window.close();
      }, 1000); // Close the tab after 1 seconds
    } catch (err) {
      // Display error message
      setErrMsg("שגיאה בעת שינוי הסיסמה.");
    }
    setLoading(false);
  };

  return (
    <div>
      <nav>
        {/* Navigation bar */}
        <NavBar />
      </nav>
      <div
        className="container d-flex justify-content-center pt-5 pb-5"
        dir="rtl"
      >
        <div className="card card-signin z-index-0 fadeIn3 fadeInBottom ">
          <form className="form-control p-5" onSubmit={handleSubmit}>
            <p className="h3 fw-bold text-center mb-2 pb-4 border-bottom">
              איפוס סיסמה
            </p>
            <div className="input-group input-group-outline mb-4 pt-4 ps-4">
              {/* Input field for new password */}
              <input
                type="password"
                placeholder="סיסמה חדשה"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group input-group-outline mb-4 pt-4 ps-4">
              {/* Input field for confirming new password */}
              <input
                type="password"
                placeholder="אימות סיסמה חדשה"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Display error message if any */}
            {errMsg && <div className="alert alert-danger">{errMsg}</div>}
            {/* Display success message if any */}
            {successMsg && (
              <div className="alert alert-success">{successMsg}</div>
            )}
            {/* Submit button */}
            <div className="row border-bottom">
              <div className="mb-4 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary d-block"
                  disabled={loading}
                >
                  שנה סיסמה
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
