require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const connectToDB = require('./db');
const app = express();

app.use(express.json());
connectToDB();
const whitelist = [ "https://travelbillsplitter.netlify.app" , "http://localhost:3000", "http://localhost:3001"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use('/api/v1' , require('./routes/userRoutes'))
app.use('/api/v1' , require('./routes/tripRoutes'))
app.use('/api/v1',require('./routes/emailroutes'))

app.get('/',(req,res)=>{
    res.send("Travel Bill Splitter Api")
})
const port = process.env.PORT || 5000
app.listen(port , ()=>{
    console.log("Running on port"+port)
})