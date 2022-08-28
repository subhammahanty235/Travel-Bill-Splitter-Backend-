require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const connectToDB = require('./db');
const app = express();

app.use(cors());
app.use(express.json());
connectToDB();

app.use('/api/v1' , require('./routes/userRoutes'))
app.use('/api/v1' , require('./routes/tripRoutes'))

app.get('/',(req,res)=>{
    res.send("Travel Bill Splitter Api")
})
const port = process.env.PORT || 5000
app.listen(port , ()=>{
    console.log("Running on port"+port)
})