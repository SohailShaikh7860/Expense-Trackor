import TripExpenses from "../model/tripeExpenses.js";
import { validationResult } from "express-validator";
import { cloudinary } from "../utils/cloudinary.js";

const createTripExpense = async(req,res)=>{
 
        console.log('CREATE TRIP BODY:', req.method, req.originalUrl, req.headers['content-type'], req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {Vehicle_Number, route, monthAndYear, totalIncome, fuelCost, driverAllowance, hamaali, paidTransport, maintenanceCost, otherExpenses, commission, pendingAmount, paymentStatus,phonePai} = req.body;

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
            paymentStatus: paymentStatus || "Pending",
            phonePai: phonePai || 0
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
        const trip = await TripExpenses.findById(id).lean({ virtuals: true });
        if(!trip){
            return res.status(404).json({message:"Trip expense not found"});
        }
        res.status(200).json({trip});
    } catch (error) {
        console.log("Error",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getAllTripExpenses = async(req,res)=>{
    try {
        const trips = await TripExpenses.find().sort({createdAt: -1});
        return res.status(200).json({trips, count: trips.length});
    } catch (error) {
        console.error('Get trips error:',error);
        return res.status(500).json({message:"Failed to retrieve trips"});
    }
}

const updateTrips = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  const allowedFields = [
    "Vehicle_Number",
    "route",
    "monthAndYear",
    "totalIncome",
    "fuelCost",
    "hamaali",
    "paidTransport",
    "maintenanceCost",
    "otherExpenses",
    "commission",
    "pendingAmount",
    "paymentStatus",
    "phonePai"
  ];

  const updates = {};

  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  
  if (updates.Vehicle_Number)
    updates.Vehicle_Number = updates.Vehicle_Number.trim().toUpperCase();

  if (updates.route)
    updates.route = updates.route.trim();

  if (updates.monthAndYear)
    updates.monthAndYear = updates.monthAndYear.trim();

 
  if (req.body.driverAllowance) {
    updates.driverAllowance = {
      totalSalary: req.body.driverAllowance.totalSalary ?? undefined,
      bonus: req.body.driverAllowance.bonus ?? undefined,
      paid: req.body.driverAllowance.paid ?? undefined
    };
  }

  try {
    const updatedTrip = await TripExpenses.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip expense not found" });
    }

    return res.status(200).json({
      message: "Trip expense updated successfully",
      trip: updatedTrip
    });

  } catch (error) {
    console.error("Update trip error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTrip = async(req,res)=>{
    const {id}= req.params;

    try {
        const deletTrip = await TripExpenses.findByIdAndDelete(id);
        if(!deletTrip){
            return res.status(404).json({message:"Trip expense not found"});
        }
        return res.status(200).json({message:"Trip expense deleted successfully"});
    } catch (error) {
        console.error("Delete trip error:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const uploadRecipt = async(req,res)=>{
    try {
      
       
      const {id} = req.params;
      if(!req.file){
        return res.status(400).json({message:"No file uploaded"});
      }

      const trip = await TripExpenses.findById(id);
      if(!trip){
         await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({message:"Trip expense not found"});
      }

            console.log('Available properties:', Object.keys(req.file));


      trip.receipts.push({
        url: req.file.path,
        public_id: req.file.filename,
        uploadedAt: new Date()
      })
      await trip.save();
      res.status(200).json({message:"Receipt uploaded successfully", receipt: trip.receipts[trip.receipts.length - 1]});
    } catch (error) {
      console.log('upload error',error);
      return res.status(500).json({message:"Failed to upload receipt"});
    }
}

const deleteRecipt = async(req,res)=>{
    try {
      const {id, receiptId} = req.params;

      const trip = await TripExpenses.findById(id);
      if(!trip){
        return res.status(404).json({message:"Trip expense not found"});
      }

      const receipt = trip.receipts.id(receiptId);
      if(!receipt){
        return res.status(404).json({message:"Receipt not found"});
      }

      await cloudinary.uploader.destroy(receipt.public_id);

      trip.receipts.pull(receiptId);
      await trip.save();

      res.status(200).json({message:"Receipt deleted successfully"});
    } catch (error) {
      console.log('delete receipt error',error);
      return res.status(500).json({message:"Failed to delete receipt"});
    }
  }

 const getReceipts = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await TripExpenses.findById(id).select('receipts');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ receipts: trip.receipts });
  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({ message: 'Failed to get receipts' });
  }
};

export{
    createTripExpense,
    getTripExpenses,
    getAllTripExpenses,
    updateTrips,
    deleteTrip,
    uploadRecipt,
    deleteRecipt,
    getReceipts
}