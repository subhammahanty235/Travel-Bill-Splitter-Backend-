require('dotenv').config()
const User = require('../models/user')
const Trip = require('../models/trip')
const jwt = require("jsonwebtoken")

// To login for users with the trip ID of an existing Trip
const loginToExistingTrip = async(req,res)=>{
    const{name , password ,emailId, tripid} = req.body;
    let flag = false;         //to check operation is successfull or not.
    try {
        const currentTripId = await Trip.findOne({tripID:tripid})
        if(currentTripId){
            const user = await User.findOne({name:name});
            // res.send(user.password)
            if(!user){
                const user = await User.create({
                    name:name , password:password, tripid:tripid ,emailId:emailId
                });
                const data = {
                    user: {
                      id: user.id
                    // }
                    }
                }
                const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    
                const addUser = await Trip.findByIdAndUpdate(currentTripId._id,{$push:{users:data._id}})
                flag = true;
                res.status(200).json({flag , authtoken})
            }
            else{
                if(user.password === password){
                    const data = {
                        user: {
                          id: user.id
                        }
                    }
                    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
                    flag = true;
                    res.status(200).json({flag , authtoken})
                }
            }
            
            
        }
        else{
            flag = false;
        }

        
        
    } catch (error) {
        console.log(error)
    }
}

// To login if user want to create a new trip
const loginToNewTrip = async(req,res)=>{
    const{name , password , tripName ,emailId} = req.body;
    let flag = false;        //to check login operation is successfull or not
    try {
        const tripId = Math.floor(Math.random() * (994989 - 123372)) + 123372;                 //it generates a six digit random number from 123372 to 994989 to use as tripId 
        const user = await User.create({
            name:name,
            password:password,
            tripid:tripId,
            emailId:emailId
        })
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);

        const data2 = await Trip.create({
            tripID:tripId,
            tripName:tripName,
        })
        const addUser = await Trip.findByIdAndUpdate(data2._id,{$push:{users:user._id}})       //this will add this user to trip's user array 
        flag = true  
        res.send({flag , authtoken})
    } catch (error) {
         console.log(error)
    }
        

       
    
}

const newTransaction = async(req,res) =>{
    const {expenseTitle , amount , users , tripId} = req.body;
    let myId = req.user.id;
   
    
    let  initialTripBudget = await Trip.findById(tripId).select("budgetTotal , -_id")
    let  totalPaidAmount = await User.findById(myId).select("totalAmountpaid , -_id")
    let  myName = await User.findById(myId).select("name , -_id")
    initialTripBudget=  initialTripBudget.budgetTotal
    totalPaidAmount = totalPaidAmount.totalAmountpaid
    const incrementBudget = await Trip.findByIdAndUpdate(tripId,{
        $inc:{
            budgetTotal:amount,
        }
    })
    const mypaidTransaction = await User.findByIdAndUpdate(myId , {
        $set:{
            totalAmountpaid:totalPaidAmount += amount 
        },

        $push:{
            allPaymentDetailsofPaid:{
                users:users,
                expensetitle: expenseTitle,
                amount:amount ,
                paidBy:myName.name,
            }
        }
    })

    
    let totalMoneyIPaid = amount;
    let moneyeveryindividualwillPay = totalMoneyIPaid / users.length
    users.forEach(async(user)=>{
        const id = await User.find({name:user}).select("_id , totalAmountToPay")
        const initialtotalAmount = id[0].totalAmountToPay;
        const setallamounttoPay = await User.findByIdAndUpdate(id[0]._id,{
            $set:{
                totalAmountToPay: initialtotalAmount + moneyeveryindividualwillPay 
            },
            $push:{
                expenseDetailstopay:{
                    paidBy:myId,
                    expenseTitle:expenseTitle,
                    amount:moneyeveryindividualwillPay
                }
                
            }
        })
        
    })
    res.json({mypaidTransaction} )
    
}


const amountToPay = async(req,res)=>{
    const id = req.user.id
    try {
        const data = await User.findById(id).select("-_id , expenseDetailstopay , totalAmountToPay ")
        
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}


const PayMoney = async(req,res)=>{
    const {amount ,  payingTo , payingfor } = req.body
    const myId = req.user.id
    let flag = false;
    try {
        const setpaidByMe = await User.updateOne({_id: myId, "expenseDetailstopay.expenseTitle": payingfor },{
            $set:{
                "expenseDetailstopay.$.paidByMe": true

                }
        })
        const setPaidByMe = await User.findByIdAndUpdate(myId , {
            
            $inc:{
                totalAmountToPay:-amount
                 
            },
            $inc:{
                totalAmountPaidToOthers:amount
            },
            $push:{
                myPaymentsToOthers:{
                    amount:amount,
                    paidTo:payingTo,
                    Paidfor:payingfor,
                },
                allPaymentDetailsofPaid:{
                    returnedMoney:myId._id
                }
            }
        })
        
       
        const addToRecieved = await User.findByIdAndUpdate(payingTo , {
            $push:{
                paymentRecievedDetails:{
                    recievedFrom:myId,
                    amountRecieved:amount,
                    recievedFor:payingfor,
                    
                },
                allPaymentDetailsofPaid:{

                }
                
            },
            $inc:{
                
                totalAmountRecieved:amount
                
            }
    
        })
        flag = true;
        // res.json(flag)
    } catch (error) {
       
        console.log(error)
    }
    
    
    res.send(flag)

    
}
const recievedMoney = async(req,res)=>{

    try {
        const Id = req.params.id
        const allRecievedPaymentDetails = await User.find({_id:Id}).select("-_id , paymentRecievedDetails")
        
        let maindata= allRecievedPaymentDetails[0].paymentRecievedDetails
        res.json(maindata);
    } catch (error) {
        console.log(error)
    }
}

const getUserDetails = async(req,res)=>{
    // this will fetch initial details about user and trip after login or page refresh
    try {
        let userId = req.user.id;
        // let tripid = trip.tripId;
        
        const user = await User.findById(userId).select("-password")
        const gettripID = await Trip.find({tripID:user.tripid}).select("_id")
        const trip = await Trip.findById(gettripID)
        res.send({user , trip})
    } catch (error) {
        console.log(error)
    }



}
const getSpecificUserdetail = async(req,res)=>{
    try {
        const id = req.params.id
        const data = await User.findById(id);
        return data.name;
        // res.send(data)
    } catch (error) {
        console.log(error)
    }

}
// const recievedMoney = async(req,res)=>{

//     try {
//         const Id = req.params.id
//         const allRecievedPaymentDetails = await User.find({_id:Id}).select("-_id , expenseDetailstopay ")
//         res.json(allRecievedPaymentDetails)
//         // let maindata= allRecievedPaymentDetails[0].paymentRecievedDetails
//         // res.json(maindata);
//     } catch (error) {
//         console.log(error)
//     }
// }


module.exports = {loginToExistingTrip , loginToNewTrip , newTransaction , amountToPay , PayMoney ,recievedMoney ,getUserDetails , getSpecificUserdetail}