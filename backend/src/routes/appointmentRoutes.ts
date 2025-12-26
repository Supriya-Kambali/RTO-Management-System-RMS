import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import {
  bookAppointment,
  listAppointments,
  getMyAppointments,
  getAppointment,
  rescheduleMyAppointment,
  cancelMyAppointment,
  completeAnAppointment,
} from "../controllers/appointmentController";

const router = Router();

// Admin/Officer - Get all appointments
router.get("/appointments", authMiddleware, roleMiddleware([ROLES.SUPER_ADMIN, ROLES.RTO_ADMIN, ROLES.RTO_OFFICER]), listAppointments);

// Citizen - Get my appointments
router.get("/appointments/my", authMiddleware, roleMiddleware([ROLES.CITIZEN]), getMyAppointments);

// Get appointment by ID
router.get("/appointments/:id", authMiddleware, getAppointment);

// Citizen - Book an appointment
router.post("/appointments/book", authMiddleware, roleMiddleware([ROLES.CITIZEN]), bookAppointment);

// Citizen - Reschedule an appointment
router.put("/appointments/:id/reschedule", authMiddleware, roleMiddleware([ROLES.CITIZEN]), rescheduleMyAppointment);

// Citizen - Cancel an appointment
router.put("/appointments/:id/cancel", authMiddleware, roleMiddleware([ROLES.CITIZEN]), cancelMyAppointment);

// Officer - Complete an appointment
router.put("/appointments/:id/complete", authMiddleware, roleMiddleware([ROLES.RTO_OFFICER, ROLES.RTO_ADMIN]), completeAnAppointment);

export default router;
