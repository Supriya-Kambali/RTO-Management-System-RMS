import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  issueChallan,
  listChallans,
  getChallan,
  getVehicleChallans,
  getMyChallans,
  disputeAChallan,
  resolveDispute,
} from "../controllers/challanController";

const router = Router();

// GET - Admin can view all challans
router.get("/challans", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.POLICE]), listChallans);

// GET - Citizens can view their own challans
router.get("/challans/my", authMiddleware, roleMiddleware([ROLES.CITIZEN]), getMyChallans);

// GET - Authenticated users can view challans by vehicle
router.get("/challans/vehicle/:vehicleId", authMiddleware, getVehicleChallans);

// GET - Get challan by ID
router.get("/challans/:id", authMiddleware, getChallan);

// POST - Police only
router.post("/challans", authMiddleware, roleMiddleware([ROLES.POLICE]), issueChallan);

// POST - Citizen can dispute a challan
router.post("/challans/:id/dispute", authMiddleware, roleMiddleware([ROLES.CITIZEN]), disputeAChallan);

// PUT - Admin can resolve dispute
router.put("/challans/:id/resolve", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), resolveDispute);

export default router;
