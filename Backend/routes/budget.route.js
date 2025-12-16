import express from "express";
import { createBudget, getBudget, getAllBudgets } from "../controllers/budget.controllers.js";
import { body } from "express-validator";
import { authToken } from "../middleware/auth.js";

const route = express.Router();

const budgetValidation = [
    body('category').notEmpty().withMessage('Category is required'),
    body('limit').isNumeric().withMessage('Limit must be a number'),
    body('period').notEmpty().withMessage('Period is required'),
    body('startDate').isISO8601().withMessage('Invalid start date format'),
    body('endDate').isISO8601().withMessage('Invalid end date format')
]

route.use(authToken);

route.post('/addBudget', budgetValidation, createBudget);
route.get('/getBudget/:id', getBudget);
route.get('/getAllBudgets', getAllBudgets);

export default route;