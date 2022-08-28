const express = require('express')
const {loginToExistingTrip,loginToNewTrip ,newTransaction ,amountToPay ,PayMoney ,recievedMoney ,getUserDetails} = require('../controllers/userController')
const router = express.Router()

router.post('/login/existing-trip/' , loginToExistingTrip);
router.post('/login/new-trip/' , loginToNewTrip);
router.put('/user/new-transaction/' , newTransaction);
router.get('/user/amount-to-pay/:id',amountToPay)
router.post('/user/paymoney' , PayMoney)
router.get('/user/totalmoneyrecieved/:id',recievedMoney)
router.get('/user/details/:id' , getUserDetails);
module.exports = router
