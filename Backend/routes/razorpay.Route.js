import express from 'express';
import { createOrder, verifyPayment, getPayments, getSupporters } from '../controllers/razorpay.controllers.js';
import { authToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order',optionalAuth, createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/supporters', authToken, getSupporters);

router.get('/payments', authToken, getPayments);

export default router;