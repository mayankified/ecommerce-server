const express = require("express");
const cookieParser = require("cookie-parser");
const { Mongod } = require("./database/Mongo.js");
const cors=require('cors');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs')

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow cookies and other credentials to be sent
}));
dotenv.config({
  path: "./Config/config.env",
});
// Call the Mongod function to connect to the database
Mongod();

// ROuter Imports
const User=require("./Routes/userroutes.js");
app.use("/api/v1/user",User);

const Product=require("./Routes/products.js");
app.use("/api/v1/prod",Product);

const Order=require("./Routes/orderRoute.js");
app.use("/api/v1/order",Order);


app.listen(5000, () => {
  console.log(`Server is running at Port: 5000`);
});

module.exports=app;
