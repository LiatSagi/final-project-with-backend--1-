const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const app = express();

require("dotenv").config();

const PORT = 8070;

app.use(credentials);

app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb", extended: true }));

//admin routes
const adminRouter = require("./routes/admin/admin.routes");
app.use("/admin", adminRouter);

//Login routes
const loginRouter = require("./routes/login");
app.use("/main", loginRouter);

// Organization
const organizationRoutes = require("./routes/organization.routes");
app.use("/organization", organizationRoutes);

// Fund
const fundRoutes = require("./routes/fund.routes");
app.use("/fund", fundRoutes);

const donatorRoutes = require("./routes/donator/donator.routes.js");
app.use("/donator", donatorRoutes);

//requester
const requesterRoutes = require("./routes/requester.routes");
app.use("/requester", requesterRoutes);

const homeRoutes = require("./routes/home.routes");
app.use("/home", homeRoutes);

const URL = 'mongodb+srv://node_Js_Server:102938Node@cluster0.eiackwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb connection success!");
});
console.log("kkkkkkkkkkkkkkk");

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
