import {Schema} from "mongoose";

const tripeExpensesSchema = new Schema({
    Vehicle_Number:{
        type:String,
        required:true
    },
    route:{
        type:String,
        required:true
    },
    monthAndYear:{
        type:String,
        required:true
    },
    totalIncome:{
        type:Number,
        required:true
    },
    fuelCost:{
        type:String,
        default:0
    },
    driverAllowance:{
        totalSalary:{
            type:Number,
            default:0
        },
        bonus:{
            type:Number,
            default:0
        },
        paid:{
            type:Number,
            default:0
        }
    },
    hamaali:{
        type:Number,
        default:0
    },
    maintenanceCost:{
        type:Number,
        default:0
    },
    otherExpenses:{
        type:Number,
        default:0
    },
    kamishan:{
        type:Number,
        default:0
    },
    pendingAmount:{
        type:Number,
        default:0
    },
    paymentStatus: { 
        type: String,
        enum: ["Pending", "Cleared"],
        default: "Pending" 
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const TripExpenses = mongoose.model("TripExpenses", tripeExpensesSchema);
export default TripExpenses;