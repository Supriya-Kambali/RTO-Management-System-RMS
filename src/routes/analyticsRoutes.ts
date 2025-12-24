import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  getDashboard,
  getRevenue,
  getViolations,
  getMlRiskAssessment,
} from "../controllers/analyticsController";

const router = Router();

// Dashboard - Admin/Auditor
router.get("/analytics/dashboard", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.AUDITOR]), getDashboard);

// Revenue analytics - Admin/Auditor
router.get("/analytics/revenue", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.AUDITOR]), getRevenue);

// Violation analytics - Admin/Auditor/Police
router.get("/analytics/violations", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.AUDITOR, ROLES.POLICE]), getViolations);

// ML Risk assessment - Admin only
router.get("/analytics/ml-risk", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), getMlRiskAssessment);

export default router;
