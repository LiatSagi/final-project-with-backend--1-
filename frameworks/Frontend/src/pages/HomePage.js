import React from 'react';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Img1 from "./image-1.jpg"
import Img2 from "./image-2.jpg"
import Img3 from "./image-3.jpg"
import Img4 from "./image-4.jpg"
import "../App.css"
import { useState, useEffect } from 'react';
import { getFundByStatus } from '../api/fund.api';
import ViewFundsCard from '../components/fund/viewFunds/ViewFundsCard';
import DonationHomeCard from '../components/donator/HomePage/donationHomeCard';
import { getAllDonations } from '../api/donator.api';
import { Link } from 'react-router-dom';

export default function HomePage() {

    const [mostUrgentFunds, setMostUrgentFunds] = useState([]);
    const [mostUrgentDonations, setMostUrgentDonations] = useState([]);
    const [loading, setLoading] = useState(false);

   useEffect(() => {
        fetchMostUrgentFunds();
        fetchMostUrgentDonations();
    }, []);

    // Fetch most urgent funds
    const fetchMostUrgentFunds = async () => {
        try {
            const res = await getFundByStatus('approved');
            const funds = res.data.funds;
            funds.sort((a, b) => new Date(a.endingDate) - new Date(b.endingDate));
            setMostUrgentFunds(funds.slice(0, 2));
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch most urgent donations
    const fetchMostUrgentDonations = async () => {
        try {
            setLoading(true);
            const res = await getAllDonations();
            const donations = res.data;
            donations.sort((a, b) => new Date(a.donationEndDate) - new Date(b.donationEndDate));
            setMostUrgentDonations(donations.slice(0, 3));
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

  return (
    <div >
        <nav className="fixed-top">
             {/* Navigation bar */}
            <NavBar />
        </nav>

       {/* img section */}
        <div id="carouselExampleCaptions" className="carousel slide pt-6" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner" dir="rtl">
                <div className="carousel-item active">
                    <img src={Img1} className="d-block w-100 hd-image" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                        <h1 className='welcome-image-heading'>יש לך ציוד עודף שאינך משתמש בו</h1>
                        <h4 className='text-muted'>תרום אותו למי שזקוק לו</h4>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Img2} className="d-block w-100 hd-image" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                        <h1 className='welcome-image-heading'>הצטרף אלינו למסע של הערכה </h1>
                        <h4 className='text-muted'>תרום ותן להם להרגיש קצת יותר בבית</h4>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Img3} className="d-block w-100 hd-image" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                        <h1 className='welcome-image-heading'>הצטרף אלינו למסע של נתינה </h1> 
                        <h4 className='text-muted'> יחד נוכל לעשות הבדל גדול </h4>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>

         {/* Urgent donations section */}
        <div className="container mt-5" dir="rtl">
            {mostUrgentDonations.length === 0 ?(
                    <>{""}</>
                ) : (
                    <>
                        <div className="row  d-flex justify-content-center">
                            <h3 className="d-flex justify-content-center mb-4"> תרומות ציוד דחופות ביותר</h3>
                            {mostUrgentDonations.map(donation => (
                                <div className="justify-content-center col col-xxl-3h col-xl-4 col-lg-5 col-md-12 col-sm-12 h-100" key={donation._id}>
                                    <Link to={`/donator/view/${donation._id}`}>
                                        <DonationHomeCard donation={donation} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
        </div>
        {/* Display most urgent funds */}
        <div className="container mt-5" dir="rtl">
            {
                mostUrgentFunds.length === 0 ? (
                    <>{""}</>
                ) : (
                    <div className="row d-flex">
                        <h3 className="d-flex justify-content-center mb-4"> גיוסי כספים דחופים ביותר</h3>

                        {
                            mostUrgentFunds.map(fund => (
                                <ViewFundsCard key={fund._id} fund={fund} />
                            ))
                        }
                    </div>
                )
            }
        </div> 
            
        {/* About section */}
        <div className='container mt-5 ' dir="rtl">
            <h3 className='d-flex justify-content-center mb-4'>אודות</h3>

            <div className='row mb-5 justify-content-between d-flex'>
                <div className='col-5 col-lg-5 col-md-5'>
                    <img className="img-about " src={Img4} />
                </div>

                <div className='col-7 col-lg-7 col-md-7'>
                    <h5> <p>בעקבות מלחמת חרבות ברזל התגלה צורך גדול בציוד לחיילים ומפונים, אם זה ציוד טקטי או ציוד בסיסי למגורים. </p>
                       <p> במהלך המלחמה, בקשות רבות הועלו ברשתות חברתיות, אך הפלטפורמות לא היו פתרון מוצלח לבעיה. </p>
                        <p>מטרת הפרויקט היא לפתח מערכת המאגדת את כל הבקשות לציוד, בה היה ניתן להוסיף בקשות לציוד בקלות ומאפשרת למבקשים ולתורמים לאתר בקשות רלוונטיות בקלות.
                            בנוסף, המערכת מאפשרת לתרום כסף וכך גם מי שאין לו ציוד לתורמה בבית יוכל לעזור.  </p>
                    </h5>
                </div>

            </div>
        </div>
       
        <footer>
            <Footer />
        </footer>
    </div>
  )
}
