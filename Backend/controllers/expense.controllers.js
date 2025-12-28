import Expense from "../model/expense.model.js";
import { validationResult } from "express-validator";
import { scanReceipt as scanReceiptImage } from "../service/OpenAi.js";
import { cloudinary } from "../utils/cloudinary.js";

const createExpense = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const expenseData = { ...req.body, userId };

        if (expenseData.recurringFrequency === '' || !expenseData.isRecurring) {
            expenseData.recurringFrequency = null;
        }

        const newExpense = await Expense.create(expenseData);
        return res.status(201).json({ message: "Expense created successfully", newExpense });
    } catch (error) {
        console.error("Create Expense Error:", error);
        return res.status(500).json({ message: "Failed to create expense", error: error.message });
    }
}

const getAllExpense = async (req, res) => {
     try {
        const userId = req.user.id;
        const { category, startDate, endDate, sortBy = '-date', limit= 50} = req.query;

        const query = { userId };

        if (category) {
            query.category = category;
        }

        if(startDate || endDate){
            query.date = {};
            if(startDate){
                query.date.$gte = new Date(startDate);
            }
            if(endDate){
                query.date.$lte = new Date(endDate);
            }
        }

        const expenses = await Expense.find(query)
            .sort(sortBy)
            .limit(parseInt(limit));

            const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

        return res.status(200).json({ expenses, total });
     } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
     }
}

const expenseById = async (req,res)=>{
    const {id} = req.params;

    try {
        const userId = req.user.id;
        const expense = await Expense.findOne({ _id: id, userId });
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        return res.status(200).json({ expense });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteExpense = async (req,res)=>{
    const {id} = req.params;

    try {
        const userId = req.user.id;
        const expense = await Expense.findOneAndDelete({ _id: id, userId });
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateExpense = async (req,res)=>{
    const {id} = req.params;
    const updates = req.body;
    try {
        const userId = req.user.id;
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true, runValidators: true }
        );
        if(!updatedExpense){
            return res.status(404).json({message:"Expense not found"});
        }
        return res.status(200).json({ message: "Expense updated successfully", updatedExpense });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getExpenseStats = async (req, res) => {
    try {  
        const userId = req.user.id;
        const { month, year } = req.query;

        
        if (!month || !year) {
            return res.status(400).json({ 
                message: "Month and year are required",
                example: "/expense/statistics?month=12&year=2024"
            });
        }

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

       
        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ message: "Month must be between 1 and 12" });
        }

        if (yearNum < 2000 || yearNum > 2100) {
            return res.status(400).json({ message: "Year must be between 2000 and 2100" });
        }

        
        const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

       
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        const expenses = await Expense.find({ 
            userId,
            date: { $gte: startDate, $lte: endDate }
        });

        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        
        const categoryBreakdown = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const dailyExpenses = {};
        expenses.forEach(exp => {
            const date = exp.date.toISOString().split('T')[0];
            dailyExpenses[date] = (dailyExpenses[date] || 0) + exp.amount;
        });

        return res.status(200).json({ 
            success: true,
            statistics: {
                total,
                count: expenses.length,
                categoryBreakdown,
                dailyExpenses,
                period: {
                    start: startDate,
                    end: endDate,
                    month: monthNum,
                    year: yearNum
                }
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

const scanReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No receipt image provided" });
        }

        const imageUrl = req.file.path;
        
        
        const extractedData = await scanReceiptImage(imageUrl);
        
        return res.status(200).json({ 
            success: true,
            message: "Receipt scanned successfully",
            expenseData: extractedData,
            receipt: {
                url: req.file.path,
                publicId: req.file.filename
            }
        });
    } catch (error) {
        console.error("Scan receipt error:", error);
        return res.status(500).json({ 
            message: "Failed to scan receipt", 
            error: error.message 
        });
    }
};

const uploadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.user.id;
        const expense = await Expense.findOne({ _id: id, userId });
        
        if (!expense) {
           
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: "Expense not found" });
        }

        expense.receipt = {
            url: req.file.path,
            publicId: req.file.filename
        };
        
        await expense.save();
        
        return res.status(200).json({ 
            message: "Receipt uploaded successfully", 
            receipt: expense.receipt 
        });
    } catch (error) {
        console.error("Upload receipt error:", error);
        return res.status(500).json({ 
            message: "Failed to upload receipt", 
            error: error.message 
        });
    }
};

export {
    createExpense,
    getAllExpense,
    expenseById,
    deleteExpense,
    updateExpense,
    getExpenseStats,
    scanReceipt,
    uploadReceipt
}