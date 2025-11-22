import mongoose, {Schema} from "mongoose";

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
        type:Number,
        default:0
    },
    driverAllowance:{
        totalSalary:{
            type:Number,
            default:7000
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
    paidTransport:{
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
    commission:{
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
    phonePai:{
        type:Number,
        default:0
    },
    receipts:[{
        url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        },
        uploadedAt:{
            type:Date,
            default:Date.now
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps:true
},

)

tripeExpensesSchema.virtual("driverAllowance.remaining").get(function() {
  return this.driverAllowance.totalSalary + this.driverAllowance.bonus - this.driverAllowance.paid;
});

tripeExpensesSchema.virtual("netProfit").get(function() {
  const totalExpense =
    this.fuelCost +
    this.hamaali +
    this.maintenanceCost +
    this.otherExpenses +
    this.commission +
    this.driverAllowance.paid +
    this.paidTransport;
  return this.totalIncome - totalExpense;
});


const TripExpenses = mongoose.model("TripExpenses", tripeExpensesSchema);
export default TripExpenses;