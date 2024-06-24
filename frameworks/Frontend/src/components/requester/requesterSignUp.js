import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
export default function RequesterSignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  // Handle form submission
  const registerUser = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const signup = {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
    };
    // Make POST request to register user
    axios
      .post("http://localhost:8070/requester/requesterSignup", signup)
      .then((res) => {
        swal("נרשם בהצלחה", "", "success").then((value) => {
          if (value) {
            navigate("../signin");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        swal("נכשל", "בבקשה נסה שוב", "error");
      });
  };

  return (
    <div>
      <nav>
        <NavBar />
      </nav>

      <div
        className="container d-flex justify-content-center pt-5 pb-5"
        dir="rtl"
      >
        <div className="card z-index-0 fadeIn3 fadeInBottom ">
          <div className="card-body">
            <form className="form-control" onSubmit={registerUser}>
              <p className="h3 fw-bold text-center mb-2 pt-4">
                הירשם כדי להתחיל לתמוך{" "}
              </p>
              <p className="text-center mb-5 fs-5 fw-normal">
                {" "}
                רוצה להרשם כארגון? <Link to="/organization/new">לחץ כאן</Link>
              </p>
              {/* First Name and Last Name fields */}
              <div className="row input-group input-group-outline me-0 px-4 ">
                <div className="col-md-6 mb-4 px-1 ">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="שם פרטי"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="col-md-6 mb-4 px-1  ">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="שם משפחה"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              {/* Email field */}
              <div className="input-group input-group-outline mb-4 px-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              {/* Contact Number field */}
              <div className="input-group input-group-outline mb-4 px-4">
                <input
                  type="text"
                  placeholder="מספר טלפון"
                  className="form-control"
                  title="מספר טלפון בעל 10 ספרות"
                  pattern="[0]{1}[0-9]{9}"
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                  }}
                  required
                />
              </div>
              {/* Password field */}
              <div className="input-group input-group-outline mb-4 px-4 ps-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="סיסמה"
                  className="form-control rounded-end"
                  title="סיסמה מכילה לפחות 6 תווים "
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordMatch(true);
                  }}
                  required
                />
                <span className="mt-1 me-2" onClick={togglePasswordVisibility}>
                  {showPassword ? <VscEye /> : <VscEyeClosed />}
                </span>
              </div>
              {/* Confirm Password field */}
              <div className="input-group input-group-outline mb-4 px-4 ps-1">
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="אימות סיסמה"
                  className={`form-control rounded-end ${
                    passwordMatch ? "" : "is-invalid"
                  }`}
                  title="סיסמה מכילה לפחות 6 תווים "
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMatch(true); // Reset password match validation
                  }}
                  required
                />
                <span className="mt-1 me-2" onClick={togglePasswordVisibility2}>
                  {showPassword2 ? <VscEye /> : <VscEyeClosed />}
                </span>
                {!passwordMatch && (
                  <label className="invalid-feedback">
                    הסיסמה לא תואמת לסיסמה המקורית
                  </label>
                )}
              </div>
              {/* Terms and conditions checkbox */}
              <div className="mb-4 px-4">
                <label
                  htmlFor="check"
                  className="d-flex align-items-center justify-content-center "
                />
                <input type="checkbox" id="check" required />
                <span className="me-2 textmuted">
                  אני מסכים עם כל התנאים, ההגבלות ולמדיניות הפרטיות
                </span>
              </div>
              {/* Submit button */}
              <div className="row">
                <div className="mb-3  d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary d-block">
                    הירשם
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
