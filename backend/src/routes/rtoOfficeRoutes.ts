import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  addRtoOffice,
  listRtoOffices,
  getRtoOffice,
  editRtoOffice,
  removeRtoOffice,
} from "../controllers/rtoOfficeController";

const router = Router();

// SUPER_ADMIN only routes
router.post("/rto/offices", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), addRtoOffice);
router.put("/rto/offices/:id", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), editRtoOffice);
router.delete("/rto/offices/:id", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), removeRtoOffice);

// All authenticated users
router.get("/rto/offices", authMiddleware, listRtoOffices);
router.get("/rto/offices/:id", authMiddleware, getRtoOffice);

export default router;
