import mongoose, {Schema} from "mongoose";

const budgetSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    limit:{
        type:Number,
        required:true,
        min:0
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    period:{
        type:String,
        enum:['Weekly','Monthly','Yearly'],
        default:'Monthly'
    }
}, {timestamps:true});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;