const express = require('express')
const {loginToExistingTrip,loginToNewTrip ,newTransaction ,getSpecificUserdetail,amountToPay ,PayMoney ,recievedMoney ,getUserDetails} = require('../controllers/userController')
const router = express.Router()
const fetchuser = require("../middleware/authentication")

router.post('/login/existing-trip/' , loginToExistingTrip);
router.post('/login/new-trip/' , loginToNewTrip);
router.put('/user/new-transaction/' ,fetchuser, newTransaction);
router.get('/user/amount-to-pay/',fetchuser, amountToPay)
router.post('/user/paymoney' ,fetchuser, PayMoney)
router.get('/user/totalmoneyrecieved/:id',recievedMoney)
router.post('/user/me' ,fetchuser, getUserDetails);
router.get('/user/searchdetails/:id' , getSpecificUserdetail)

module.exports = router

