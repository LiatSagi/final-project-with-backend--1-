import React, { useEffect } from 'react'
import Footer from '../Footer'
import NavBar from '../NavBar'
import Profile from './profile.png';
import swal from "sweetalert";
import "./footer.css"
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { requesterProfile, updatePassword, updateProfile } from '../../api/requester.api';

export default function UpdateProfileDetails() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: ''});
  const [passData, setPassData] = useState({});
  const navigate = useNavigate();
  const [changePassword, setChangePassword] = useState(false);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    requesterProfile(userId)
      .then((res) => {
         setUserData({
          firstName: res.data.requester.firstName || '',
          lastName: res.data.requester.lastName || '',
          contactNumber:"0"+ res.data.requester.contactNumber || '',
          email: res.data.requester.email || ''
        });
      })
  }, []);
  // Handle profile update form submission
  const handleUpdate = (e) => {
    e.preventDefault()
    updateProfile(userId, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      contactNumber: userData.contactNumber,
      email: userData.email
    })
      .then((res) => {
        swal("User profile updated succesfully", "", "success").then((value) => {
          if (value) {
            navigate(-1);
          }
        });
      })
      .catch((err) => {
        console.log(err);
    });
  }
  // Handle password change form submission
  const handlePassword = (e) => {
    e.preventDefault()
    setChangePassword(!changePassword);

    if (passData.npassword === passData.rpassword) {
      updatePassword(userId, {
        password: passData.npassword
      })
        .then((res) => {
          swal("Password updated succesfully", "", "success").then((value) => {
            if (value) {
              navigate(-1);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      swal("Password does not match", "", "error");
    }
  }

  return (
    <div>
      <nav>
        <NavBar />
      </nav>
      <div className='container' dir="rtl">
        <h4 className="pt-3 ms-4">הגדרות חשבון</h4>
        <hr className='hr-request-fund mx-4' />
        <i className="bi bi-arrow-left-circle fs-4 cursor-pointer"
          onClick={() => navigate(-1)}> הקודם</i>
        <div className="container d-flex justify-content-center pt-4 pb-5">
          <div className="card z-index-0 fadeIn3 fadeInBottom ">
            <div className="card-body">
              <form className="form-control form-profile m-3">

                {/* Profile image */}
                <div className="row pt-4">
                  <div className="d-flex justify-content-center ps-2 ms-2">
                    <img className='profile-image' src={Profile} />
                  </div>
                </div>

                {/* Profile form */}
                <div className="row m-auto pt-5">
                  <div className="col ms-2 pe-5 ">
                    <div className="row">
                      <div className="col">

                        <div className="row input-group input-group-outline mb-4">
                          <label htmlFor="form-control">שם פרטי</label>
                          <input type="text"
                            className="form-control"
                            defaultValue={userData.firstName}
                            onChange={(e) => { setUserData({ ...userData, "firstName": e.target.value }) }}
                          />
                        </div>
                      </div>

                      <div className="col">
                        <div className="row input-group input-group-outline mb-4">
                          <label htmlFor="form-control">שם משפחה</label>
                          <input type="text"
                            className="form-control"
                            defaultValue={userData.lastName}
                            onChange={(e) => { setUserData({ ...userData, "lastName": e.target.value }) }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row input-group input-group-outline mb-4">
                      <label htmlFor="form-control">מספר טלפון</label>
                      <input type="text"
                              // setUserData({ ...userData, "contactNumber": "0"+ res.data.requester.contactNumber})

                        className="form-control"
                        value={userData.contactNumber}
                        onChange={(e) => { setUserData({ ...userData, "contactNumber": e.target.value }) }}
                      />
                    </div>

                    <div className="row input-group input-group-outline mb-4">
                      <label htmlFor="form-control" >מייל</label>
                      <input type="email"
                        id="form-control"
                        className="form-control"
                        defaultValue={userData.email}
                        onChange={(e) => { setUserData({ ...userData, "email": e.target.value }) }}
                      />
                    </div>
                    <div className="mb-4 d-flex justify-content-center">
                      <button className="btn btn-success" onClick={handleUpdate}>
                        שמור שינויים
                      </button>
                      <button className="btn btn-info me-4" onClick={handlePassword}>
                        {changePassword ? "סגור שינוי סיסמה" : "שינוי סיסמה"}
                      </button>
                    </div>
                  </div>

                   {/* Password change section */}
                  {changePassword && (
                    <div className="row input-group input-group-outline col align-self-start me-5 border-end">
                      <div className="mb-4 ms-5">
                        <label htmlFor="form-control">סיסמה חדשה</label>
                        <input
                          type="password"
                          placeholder="סיסמה חדשה"
                          className="form-control"
                          onChange={(e) =>
                            setPassData({ ...passData, npassword: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-4 ms-5">
                        <label htmlFor="form-control">אימות סיסמה</label>
                        <input
                          type="password"
                          placeholder="אימות סיסמה"
                          className="form-control"
                          onChange={(e) =>
                            setPassData({ ...passData, rpassword: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-4 d-flex justify-content-center">
                        <button className="btn btn-success ms-4" onClick={handlePassword}>
                          שנה סיסמה
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>


      <footer>
        <Footer />
      </footer>
    </div>
  )
}
