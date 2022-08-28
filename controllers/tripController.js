const express = require('express');
const Trip = require('../models/trip')
// const router = express.Router();

const FetchUserList = async(req,res)=>{
    try {
        let {tripid} = req.body
        const data = await Trip.findById(tripid).select("-_id , users");
        // const maindata = await data.json();
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

const FetchTripDetails = async(req,res)=>{
    try {
        let {tripid} = req.body
        const data = await Trip.findById(tripid);
        res.send(data)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {FetchUserList , FetchTripDetails}

