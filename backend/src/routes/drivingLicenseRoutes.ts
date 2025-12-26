import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  approveApplication,
  rejectApplication,
  getDlByNumber,
  renewDl,
  getMyDl,
} from "../controllers/drivingLicenseController";

const router = Router();

// Citizen routes
router.get("/dl/my", authMiddleware, roleMiddleware([ROLES.CITIZEN]), getMyDl);
router.post("/dl/:dlNumber/renew", authMiddleware, roleMiddleware([ROLES.CITIZEN]), renewDl);

// RTO_ADMIN routes
router.put("/dl/applications/:id/approve", authMiddleware, roleMiddleware([ROLES.RTO_ADMIN]), approveApplication);
router.put("/dl/applications/:id/reject", authMiddleware, roleMiddleware([ROLES.RTO_ADMIN]), rejectApplication);

// All authenticated users
router.get("/dl/:dlNumber", authMiddleware, getDlByNumber);

export default router;
