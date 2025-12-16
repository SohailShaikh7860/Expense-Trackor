import Budget from '../model/budget.model.js';
import { validationResult } from 'express-validator';

export const createBudget = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const { category, limit, period, startDate, endDate } = req.body;

        const newBudget = await Budget.create({
            userId,
            category,
            limit,
            period,
            startDate,
            endDate
        })
        return res.status(201).json({ message: "Budget created successfully", newBudget });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getBudget = async(req,res)=>{
    const {id} = req.params;

    try {
        const userId = req.user.id;
        const budget = await Budget.findOne({_id:id, userId});
        if(!budget){
            return res.status(404).json({message: "Budget not found"});
        }
        return res.status(200).json({message: "Budget fetched successfully", budget});
    } catch (error) {
        return res.status(500).json({ message: "Failed to get budget", error: error.message });
    }
}

export const getAllBudgets = async(req,res)=>{
    try{
        const userId = req.user.id;
        const budgets = await Budget.find({userId}).sort({createdAt: -1});
        return res.status(200).json({budgets, count: budgets.length});
    }catch(error){
        return res.status(500).json({ message: "Failed to get budgets", error: error.message });
    }
}