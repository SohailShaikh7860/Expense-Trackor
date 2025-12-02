import mongoose, {Schema} from "mongoose";

const expenseSchma = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:[
            'Food & Drinking',
            'Transportation',
            'Shopping',
            'Entertainment',
            'Bills & Utilities',
            'Healthcare',
            'Education',
            'Travel',
            'Groceries',
            'Personal Care',
            'Other'
        ]
    },
    subcategory:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    paymentMethod:{
        type:String,
        enum:['Cash','Credit Card','Debit Card','UPI','Net Banking','Other'],
        default:'Cash'
    },
    receipt:{
        url:String,
        publicId:String
    },
    tags:{
        type:String
    },
    isRecurring:{
        type:Boolean,
        default:false
    },
    recurringFrequency:{
        type:String,
        enum:['Daily','Weekly','Monthly','Yearly'],
        default:null
    }
},{timestamps:true});

expenseSchma.index({ userId: 1, date: -1 });
expenseSchma.index({ userId: 1, category: 1 });

const Expense = mongoose.model("Expense", expenseSchma);
export default Expense;