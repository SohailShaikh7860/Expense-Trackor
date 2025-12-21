import { Router } from "express";
import {
  createTripExpense,
  getTripExpenses,
  getAllTripExpenses,
  updateTrips,
  deleteTrip,
  uploadRecipt,
  deleteRecipt,
  getReceipts
} from "../controllers/trip.controllers.js";
import { body } from "express-validator";
import { authToken } from "../middleware/auth.js";
import { upload } from "../utils/cloudinary.js";


const router = Router();

router.post(
  "/trip-expense",
  [
    body("Vehicle_Number")
      .notEmpty()
      .withMessage("Vehicle Number is required")
      .trim(),
    body("route").notEmpty().withMessage("Route is required").trim(),
    body("tripDate")
      .notEmpty()
      .withMessage("Trip Date is required")
      .trim(),
    body("totalIncome")
      .notEmpty()
      .withMessage("Total Income is required")
      .isNumeric()
      .withMessage("Total Income must be a number"),
    body("fuelCost")
      .optional()
      .isNumeric()
      .withMessage("fuelCost must be a number")
      .toFloat(),
    body("hamaali")
      .optional()
      .isNumeric()
      .withMessage("hamaali must be a number")
      .toFloat(),
    body("paidTransport")
      .optional()
      .isNumeric()
      .withMessage("paidTransport must be a number")
      .toFloat(),
    body("maintenanceCost")
      .optional()
      .isNumeric()
      .withMessage("maintenanceCost must be a number")
      .toFloat(),
    body("otherExpenses")
      .optional()
      .isNumeric()
      .withMessage("otherExpenses must be a number")
      .toFloat(),
    body("commission")
      .optional()
      .isNumeric()
      .withMessage("commission must be a number")
      .toFloat(),
    body("pendingAmount")
      .optional()
      .isNumeric()
      .withMessage("pendingAmount must be a number")
      .toFloat(),
  ],
  authToken,
  createTripExpense
);

router.put(
  "/:id",
  [
    body("Vehicle_Number")
      .optional({ values: 'falsy' })
      .trim()
      .notEmpty()
      .withMessage("Vehicle number cannot be empty"),
    body("route")
      .optional({ values: 'falsy' })
      .trim()
      .notEmpty()
      .withMessage("Route cannot be empty"),
    body("tripDate")
      .optional({ values: 'falsy' })
      .trim()
      .notEmpty()
      .withMessage("Trip Date cannot be empty"),
    body("totalIncome")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Total income must be a number"),
    body("fuelCost")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Fuel cost must be a number"),
    body("hamaali")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Hamaali must be a number"),
    body("paidTransport")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Paid transport must be a number"),
    body("maintenanceCost")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Maintenance cost must be a number"),
    body("otherExpenses")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Other expenses must be a number"),
    body("commission")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Commission must be a number"),
    body("pendingAmount")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("Pending amount must be a number"),
    body("phonePai")
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage("phonePai must be a number")
      .toFloat(),
  ],
  authToken,
  updateTrips
);

router.delete("/:id", authToken, deleteTrip);

router.get("/trip-expense/:id", authToken, getTripExpenses);
router.get("/trip-expenses", authToken, getAllTripExpenses);


router.post('/:id/receipt', authToken, upload.single('receipt'), uploadRecipt);
router.delete('/:id/receipt/:receiptId', authToken, deleteRecipt);
router.get('/:id/receipts', authToken, getReceipts);

export default router;
