const express = require('express')
const router = express.Router();
const {FetchUserList , FetchTripDetails} = require('../controllers/tripController')

router.get('/trip/fetchUsers' , FetchUserList);
router.get('/trip' , FetchTripDetails);

module.exports = router;