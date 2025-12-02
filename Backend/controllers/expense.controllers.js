import Expense from "../model/expense.model.js";
import { validationResult } from "express-validator";

const createExpense = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const expense = {...req.body, userId };

        const newExpense = await Expense.create(expense);
        return res.status(201).json({ message: "Expense created successfully", newExpense });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
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

export {
    createExpense,
    getAllExpense,
    expenseById,
    deleteExpense,
    updateExpense,
    getExpenseStats
}