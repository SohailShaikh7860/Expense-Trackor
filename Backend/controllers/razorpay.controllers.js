import razorpayInstance from "../config/Razorpay.js";
import RazorpayModel from "../model/razorpay.model.js";
import crypto from "crypto";

const fixedAmount = 49;
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const { supportName, supportMsg } = req.body;

    const option = {
      amount: fixedAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${crypto.randomBytes(10).toString("hex")}`,
      notes: {
        userId,
        purpose: "Support the development of Transport Expense Tracker",
      },
    };

    const order = await razorpayInstance.orders.create(option);

    const payment = await RazorpayModel.create({
      userId: userId,
      razorpayOrderId: order.id,
      currency: order.currency,
      amount: fixedAmount,
      status: "created",
      supportName: supportName || "Anonymous",
      supportMsg: supportMsg || "",
    });

    return res
      .status(201)
      .json({
        message: "Order created successfully",
        order,
        paymentId: payment._id,
        key: process.env.RAZORPAY_API_KEY,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }

    const payment = await RazorpayModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found!" });
    }

    if (payment.amount !== fixedAmount) {
      return res.status(400).json({ message: "Amount mismatch detected!" });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "paid";
    await payment.save();
    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await RazorpayModel.find({ userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ payments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSupporters = async (req, res) => {
  try {
    const supporters = await RazorpayModel.find({
      status: "paid",
      supportName: { $ne: null },
    })
      .select("supportName supportMsg amount createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ supporters });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
