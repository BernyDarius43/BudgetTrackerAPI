
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const connectDB  = require('./config/db');
const firebase = require("./config/firebase");

const app = express();
var corsOptions = {
    origin: "http://localhost:3000"
  };
  
//MiddleWare
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to mongoDB
connectDB();



//routes
const income = require('./routes/income')
const homeRoute   = require('./routes/home')
const expenseRoute = require('./routes/expense')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(homeRoute)
app.use(income)
app.use(expenseRoute)
app.use(authRoutes);
app.use(userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, ()=> {
    console.log("you are listening on port :", PORT);
})
