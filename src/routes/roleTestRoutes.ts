import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { adminTest, officerTest, citizenTest } from "../controllers/roleTestController";

const router = Router();

// Admin only route
router.get("/admin/test", authMiddleware, roleMiddleware([ROLES.ADMIN]), adminTest);

// Officer only route
router.get("/officer/test", authMiddleware, roleMiddleware([ROLES.OFFICER]), officerTest);

// Citizen only route
router.get("/citizen/test", authMiddleware, roleMiddleware([ROLES.CITIZEN]), citizenTest);

export default router;
