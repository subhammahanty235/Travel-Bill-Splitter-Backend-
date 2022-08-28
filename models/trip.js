const {Schema, default: mongoose} = require('mongoose')

const TripSchema = new Schema({
    tripName:{
        type:String,
        required:true,
    },
    tripID:{
        type:Number,
        
    },
    users:[String],
    budgetTotal:{
        type:Number,
        default:0,
    }
})

const Trip = mongoose.model('trips' , TripSchema )

module.exports = Trip;