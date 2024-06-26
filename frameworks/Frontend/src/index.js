import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Donator from "./routes/donator.routes";
import Organization from "./routes/organization.routes";
import Admin from "./routes/admin.routes";
import Fund from "./routes/fund.routes";
import User from "./routes/user.routes";

// Define roles for authentication
const ROLES = {
  'User': 1984,
  'Organization': 5150,
  'Admin': 2001
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/donator/*" element={<Donator />} />
      <Route path="/organization/*" element={<Organization />} />
      <Route path="/admin/*" element={<Admin />}/>
      <Route path="/fund/*" element={<Fund />} />
      <Route path="/user/*" element={<User />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
