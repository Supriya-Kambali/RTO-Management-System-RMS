import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { getMyNotifications, markAsRead, sendNotification } from "../controllers/notificationController";

const router = Router();

// Get all notifications for logged-in user
router.get("/notifications", authMiddleware, getMyNotifications);

// Mark a notification as read
router.put("/notifications/:id/read", authMiddleware, markAsRead);

// Send a notification (Admin only)
router.post("/notifications/send", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN]), sendNotification);

export default router;
