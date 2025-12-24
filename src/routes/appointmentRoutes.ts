import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { bookAppointment, getMyAppointments, cancelMyAppointment } from "../controllers/appointmentController";

const router = Router();

// Citizen only routes
router.post("/appointments/book", authMiddleware, roleMiddleware([ROLES.CITIZEN]), bookAppointment);
router.get("/appointments/my", authMiddleware, roleMiddleware([ROLES.CITIZEN]), getMyAppointments);
router.put("/appointments/:id/cancel", authMiddleware, roleMiddleware([ROLES.CITIZEN]), cancelMyAppointment);

export default router;
