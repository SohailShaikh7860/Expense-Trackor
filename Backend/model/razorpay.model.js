import mongoose, {Schema} from "mongoose";

const razorSchema = Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
        default:null
    },
    razorpayOrderId:{
        type:String,
        required:true,
        unique:true
    },
    razorpayPaymentId:{
        type:String,
    },
    razorpaySignature:{
        type:String,
    },
    currency:{
        type:String,
        default:'INR'
    },
    status:{
        type:String,
        enum:['created','paid','failed'],
        default:'created'
    },
    supportName:{
        type:String
    },
    supportMsg:{
        type:String
    },
    amount:{
        type:Number,
        required:true
    }
}, {timestamps:true});

const RazorpayModel = mongoose.model('Razorpay', razorSchema);
export default RazorpayModel;