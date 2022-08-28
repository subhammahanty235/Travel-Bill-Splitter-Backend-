const {Schema, default: mongoose} = require('mongoose')

const UserSchema = new Schema(
    {

        name:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        tripid:{
            type:String,
            required:true,
        },

        totalAmountToPay:{
            type:Number,
            default:0
        },
        totalAmountpaid:{
            type:Number,
            default:0
        },
        totalAmountRecieved:{
            type:Number,
            default:0
        },
        expenseDetailstopay:[

            {
               
                paidBy:{
                    type:String
                },
                
                expenseTitle:String,
                
                amount:Number,
                paidByMe:{
                    type:Boolean,
                    default:false,
                },
            }
        ]
    ,
        
        allPaymentDetailsofPaid:[
                {
                    paidBy:{
                        type:String
                    },
                    // paidBy:{
                    
                    //     type:Schema.Types.ObjectId,
                    //     ref:'users'
                    // },
                users:[String],
                expensetitle:String,
                amount:Number,
            }
        ],

        paymentRecievedDetails:[
            {
                recievedFrom:String,
                amountRecieved:Number,
                recievedFor:String,
                paidDate:{
                        type:Date,
                        default:Date.now(),
                    
                }
            },
            

        ],
        myPaymentsToOthers:[{
            amount:Number,
            paidTo:String,
            paidFor:String,
            date:{
                type:Date,
                default:Date.now()
            }
        }
           

        ]
    }
)

const User = mongoose.model('users' , UserSchema);
module.exports = User;