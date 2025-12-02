import express from "express";
import { body } from "express-validator";
import { authToken } from "../middleware/auth.js";
import { createExpense, getAllExpense, expenseById, deleteExpense, updateExpense, getExpenseStats } from "../controllers/expense.controllers.js";

const router = express.Router();

const expenseValidation = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format')
];


router.use(authToken);


router.post('/', expenseValidation, createExpense);
router.get('/', getAllExpense);
router.get('/statistics', getExpenseStats);
router.get('/:id', expenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;