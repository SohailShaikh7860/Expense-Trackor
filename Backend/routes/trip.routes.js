import { Router } from "express";
import { createTripExpense, getTripExpenses } from "../controllers/trip.controllers.js";
import { body } from "express-validator";
import {authToken} from "../middleware/auth.js";

const router = Router();

router.post('/trip-expense',
    body('Vehicle_Number').notEmpty().withMessage('Vehicle Number is required').trim(),
    body('route').notEmpty().withMessage('Route is required').trim(),
    body('monthAndYear').notEmpty().withMessage('Month and Year are required').trim(),
    body('totalIncome').notEmpty().withMessage('Total Income is required').isNumeric().withMessage('Total Income must be a number'),
     body('fuelCost').optional().isNumeric().withMessage('fuelCost must be a number').toFloat(),
  body('hamaali').optional().isNumeric().withMessage('hamaali must be a number').toFloat(),
  body('paidTransport').optional().isNumeric().withMessage('paidTransport must be a number').toFloat(),
  body('maintenanceCost').optional().isNumeric().withMessage('maintenanceCost must be a number').toFloat(),
  body('otherExpenses').optional().isNumeric().withMessage('otherExpenses must be a number').toFloat(),
  body('commission').optional().isNumeric().withMessage('commission must be a number').toFloat(),
  body('pendingAmount').optional().isNumeric().withMessage('pendingAmount must be a number').toFloat(),
    authToken,
    createTripExpense
);

router.get('/trip-expense/:id',authToken,getTripExpenses);
export default router;