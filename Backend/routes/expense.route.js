import express from "express";
import { body } from "express-validator";
import { authToken } from "../middleware/auth.js";
import { createExpense, getAllExpense, expenseById, deleteExpense, updateExpense, getExpenseStats, scanReceipt, uploadReceipt } from "../controllers/expense.controllers.js";
import { uploadExpenseReceipt } from "../utils/cloudinary.js";

const router = express.Router();

const expenseValidation = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format')
];


router.use(authToken);


router.post('/', expenseValidation, createExpense);
router.post('/scan-receipt', uploadExpenseReceipt.single('receipt'), scanReceipt);
router.post('/:id/receipt', uploadExpenseReceipt.single('receipt'), uploadReceipt);
router.get('/', getAllExpense);
router.get('/statistics', getExpenseStats);
router.get('/:id', expenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;