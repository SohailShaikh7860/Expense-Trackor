import TripExpenses from "../model/tripeExpenses.js";
import { validationResult } from "express-validator";

const createTripExpense = async(req,res)=>{
 
        console.log('CREATE TRIP BODY:', req.method, req.originalUrl, req.headers['content-type'], req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {Vehicle_Number, route, monthAndYear, totalIncome, fuelCost, driverAllowance, hamaali, paidTransport, maintenanceCost, otherExpenses, commission, pendingAmount, paymentStatus} = req.body;

    Vehicle_Number = Vehicle_Number?.trim().toString().toUpperCase();
    route = route?.trim().toString();
    monthAndYear = monthAndYear?.trim().toString();


    try {
        const tripExpense = await TripExpenses.create({
            Vehicle_Number,
            route,
            monthAndYear,
            totalIncome,
            fuelCost: fuelCost || 0,
            driverAllowance: driverAllowance || { totalSalary: 7000, bonus: 0, paid: 0 },
            hamaali: hamaali || 0,
            paidTransport: paidTransport || 0,
            maintenanceCost: maintenanceCost || 0,
            otherExpenses: otherExpenses || 0,
            commission: commission || 0,
            pendingAmount: pendingAmount || 0,
            paymentStatus: paymentStatus || "Pending"
        });

        const netProfit = tripExpense.netProfit;

        console.log("Profit",netProfit);
        

        return res.status(201).json({message:"Trip expense created successfully", tripExpense});
    } catch (error) {
        console.log("Error",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getTripExpenses = async(req,res)=>{
    const {id}= req.params;

    try {
        const trip = await tripExpense.findById(id).lean({ virtuals: true });
        if(!trip){
            return res.status(404).json({message:"Trip expense not found"});
        }
        res.status(200).json({trip});
    } catch (error) {
        console.log("Error",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export{
    createTripExpense,
    getTripExpenses
}