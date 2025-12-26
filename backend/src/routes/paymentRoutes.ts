import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  initiateNewPayment,
  verifyAPayment,
  payChallan,
  listPayments,
  getPayment,
  getMyPayments,
  refundAPayment,
} from "../controllers/paymentController";

const router = Router();

// Admin - Get all payments
router.get("/payments", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.AUDITOR]), listPayments);

// Citizen - Get payment history
router.get("/payments/history", authMiddleware, roleMiddleware([ROLES.CITIZEN]), getMyPayments);

// Get payment by ID
router.get("/payments/:id", authMiddleware, getPayment);

// Citizen - Initiate a payment
router.post("/payments/initiate", authMiddleware, roleMiddleware([ROLES.CITIZEN]), initiateNewPayment);

// Citizen - Pay challan (legacy)
router.post("/payments/pay/:challanId", authMiddleware, roleMiddleware([ROLES.CITIZEN]), payChallan);

// Verify/complete a payment
router.put("/payments/:id/verify", authMiddleware, verifyAPayment);

// Admin - Refund a payment
router.post("/payments/:id/refund", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), refundAPayment);

export default router;
