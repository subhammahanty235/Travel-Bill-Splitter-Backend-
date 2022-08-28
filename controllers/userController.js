const User = require('../models/user')
const Trip = require('../models/trip')

// To login for users with the trip ID of an existing Trip
const loginToExistingTrip = async(req,res)=>{
    const{name , password , tripid , amountPaid} = req.body;
    let flag = false;         //to check operation is successfull or not.
    try {
        const currentTripId = await Trip.findOne({tripID:tripid})
        if(currentTripId){
            const isuserAreadyPresent = await User.findOne({name:name});
            if(!isuserAreadyPresent){
                const data = await User.create({
                    name:name , password:password, tripid:tripid 
                });
    
                const addUser = await Trip.findByIdAndUpdate(currentTripId._id,{$push:{users:data._id}})
                flag = true;
            }
            else{
                flag = false;
            }
            
        }
        else{
            flag = false;
        }

        
        res.status(200).json({flag})
    } catch (error) {
        console.log(error)
    }
}

// To login if user want to create a new trip
const loginToNewTrip = async(req,res)=>{
    const{name , password , tripName ,} = req.body;
    let flag = false;        //to check login operation is successfull or not
    try {
        const tripId = Math.floor(Math.random() * (994989 - 123372)) + 123372;                 //it generates a six digit random number from 123372 to 994989 to use as tripId 
        const data = await User.create({
            name:name,
            password:password,
            tripid:tripId
            
        })
        const data2 = await Trip.create({
            tripID:tripId,
            tripName:tripName,
        })
        const addUser = await Trip.findByIdAndUpdate(data2._id,{$push:{users:data._id}})       //this will add this user to trip's user array 
        flag = true  
        res.send({addUser , flag})
    } catch (error) {
         console.log(error)
    }
        

       
    
}

const newTransaction = async(req,res) =>{
    const {expenseTitle , amount , users , myId , tripId} = req.body;
    let  totalPaidAmount = await User.find({_id : myId}).select("totalAmountpaid , -_id")
    let  initialTripBudget = await Trip.find({_id : tripId}).select("budgetTotal , -_id")
    initialTripBudget=  initialTripBudget[0].budgetTotal
    totalPaidAmount = totalPaidAmount[0].totalAmountpaid
    const mypaidTransaction = await User.findByIdAndUpdate(myId , {
        $set:{
            totalAmountpaid:totalPaidAmount += amount 
        },
        $push:{
            allPaymentDetailsofPaid:{
                users:users,
                expensetitle: expenseTitle,
                amount:amount ,
                paidBy:myId
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
    const id = req.params.id
    try {
        const data = await User.find({_id:id}).select("-_id , expenseDetailstopay , totalAmountToPay ")
        const filteredData = data[0]
        res.json(filteredData)
    } catch (error) {
        console.log(error)
    }
}


const PayMoney = async(req,res)=>{
    const {amount , myId , payingTo , payingfor } = req.body
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
            $push:{
                myPaymentsToOthers:{
                    amount:amount,
                    paidTo:payingTo,
                    Paidfor:payingfor,
                }
            }
        })
        
       
        const addToRecieved = await User.findByIdAndUpdate(payingTo , {
            $push:{
                paymentRecievedDetails:{
                    recievedFrom:myId,
                    amountRecieved:amount,
                    recievedFor:payingfor,
                }
            },
            $inc:{
                
                totalAmountRecieved:amount
                
            }
    
        })
        flag = true;
        res.json(flag)
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
    try {
        const id = req.params.id
        const data = await User.findById(id);
        res.send(data)
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


module.exports = {loginToExistingTrip , loginToNewTrip , newTransaction , amountToPay , PayMoney ,recievedMoney ,getUserDetails}