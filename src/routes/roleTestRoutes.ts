import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { adminTest, officerTest, citizenTest } from "../controllers/roleTestController";

const router = Router();

// Super Admin / RTO Admin only route
router.get("/admin/test", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), adminTest);

// Officer only route
router.get("/officer/test", authMiddleware, roleMiddleware([ROLES.RTO_OFFICER]), officerTest);

// Citizen only route
router.get("/citizen/test", authMiddleware, roleMiddleware([ROLES.CITIZEN]), citizenTest);

export default router;
