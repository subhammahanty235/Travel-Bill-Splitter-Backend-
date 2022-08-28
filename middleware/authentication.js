require('dotenv').config()
const jwt = require('jsonwebtoken');
// const { FetchUserList } = require('../controllers/tripController');

const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error : "please authenticte using a valid token"})
    }
    try {
        const data = jwt.verify(token , process.env.JWT_SECRET);
        req.user = data.user;
        // req.trip = data.tripId;
        next();
    } catch (error) {
        res.status(401).send({error : "please authenticte using a valid token"})
    }
}

module.exports = fetchUser