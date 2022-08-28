const mongoose = require('mongoose')
const mongo_uri = process.env.MONGO_URI 

const connectToDB = ()=>{
    mongoose.connect(mongo_uri,()=>{
        console.log("Connected to db successfully")
    })
}

module.exports = connectToDB