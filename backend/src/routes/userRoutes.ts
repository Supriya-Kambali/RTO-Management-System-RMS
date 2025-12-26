import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  listUsers,
  getUser,
  updateUser,
  removeUser,
  assignRole,
  getProfile,
  updateProfile,
} from "../controllers/userController";

const router = Router();

// Profile routes (all authenticated users)
router.get("/users/profile", authMiddleware, getProfile);
router.put("/users/profile", authMiddleware, updateProfile);

// SUPER_ADMIN only routes
router.get("/users", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), listUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), removeUser);
router.post("/users/assign-role", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN]), assignRole);

// Admin routes (SUPER_ADMIN, RTO_ADMIN)
router.get("/users/:id", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), getUser);
router.put("/users/:id", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), updateUser);

export default router;
