import axios from "../../api/axios";
import React, { useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import "./footer.css";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const LOGIN_URL = "/login/login";

export default function RequesterSignIn() {
  const [cookies, setCookie] = useCookies(["access_token", "roles", "_id"]);
  const Navigate = useNavigate();
  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear error message when username or password changes
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = username;
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { accessToken, roles, _id } = response.data;

      // Set cookies for authentication
      let expires = new Date();
      expires.setTime(expires.getTime() + 60 * 60 * 1000);
      setCookie("access_token", accessToken, { path: "/", expires });
      setCookie("roles", roles, { path: "/", expires });
      setCookie("uId", _id, { path: "/", expires });
      setCookie("isAuth", "active", { path: "/", expires });
      // Redirect based on user role
      if (roles === "5150") {
        Navigate("/organization/dashboard");
      } else if (roles === "1984") {
        Navigate(`/`);
      } else if (roles === "2001") {
        Navigate(`/admin/dashboard`);
      }
      // Clear form fields
      setUsername("");
      setPassword("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrMsg("שם המשתמש או הסיסמה שגויים");
      } else {
        setErrMsg("שגיאה בעת התחברות");
      }
    }
    setLoading(false);
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
        <div className="card card-signin z-index-0 fadeIn3 fadeInBottom ">
          <form className="form-control p-5" onSubmit={handleSubmit}>
            <p className="h3 fw-bold text-center mb-2 pb-4 border-bottom">
              התחבר
            </p>
            {/* Email input */}
            <div className="input-group input-group-outline mb-4 pt-4 ps-4">
              <input
                type="email"
                placeholder="מייל"
                className="form-control"
                ref={userRef}
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/* Password input */}
            <div className="input-group input-group-outline mb-2 pt-2 ps-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="סיסמה"
                className="form-control rounded-end"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="mt-1 me-2" onClick={togglePasswordVisibility}>
                {showPassword ? <VscEye /> : <VscEyeClosed />}
              </span>
            </div>
            {/* Forgot password link */}
            <p className=" mt-1 mb-3 fs-7 ">
              * שכחת את הסיסמה? <Link to="/user/resetPassword">לחץ כאן</Link>
            </p>
            {/* Error message */}
            {errMsg && <div className="alert alert-danger">{errMsg}</div>}
            {/* Submit button */}
            <div className="row border-bottom">
              <div className="mb-4 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary d-block"
                  disabled={loading}
                >
                  התחבר
                </button>
              </div>
            </div>
            {/* Signup link */}
            <p className="text-center mb-3 pt-2 fs-5 fw-normal">
              אין לך חשבון? <Link to="/user/signup">לחץ כאן</Link>
            </p>
          </form>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
