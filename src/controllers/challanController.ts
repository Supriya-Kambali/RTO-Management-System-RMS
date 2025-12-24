import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createChallan,
  getAllChallans,
  getChallansByVehicle,
  getChallansByUser,
  getChallanById,
  disputeChallan,
  resolveChallanDispute,
} from "../models/challanModel";
import { createNotification } from "../models/notificationModel";
import pool from "../db";

// Issue a challan (Police only)
export const issueChallan = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicle_id, violation_type, amount } = req.body;

    if (!vehicle_id || !violation_type || !amount) {
      return res.status(400).json({ success: false, message: "vehicle_id, violation_type, and amount are required" });
    }

    const issued_by = req.user?.id;

    if (!issued_by) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const challan = await createChallan(vehicle_id, issued_by, violation_type, amount);

    const vehicleResult = await pool.query("SELECT owner_id FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleResult.rows[0]) {
      await createNotification(vehicleResult.rows[0].owner_id, `A challan of ₹${amount} has been issued for violation: ${violation_type}`);
    }

    res.status(201).json({ success: true, message: "Challan issued", data: { challan } });
  } catch (error) {
    console.error("Error issuing challan:", error);
    res.status(500).json({ success: false, message: "Failed to issue challan" });
  }
};

// Get all challans (Admin)
export const listChallans = async (req: AuthRequest, res: Response) => {
  try {
    const challans = await getAllChallans();
    res.json({ success: true, data: { challans } });
  } catch (error) {
    console.error("Error fetching challans:", error);
    res.status(500).json({ success: false, message: "Failed to fetch challans" });
  }
};

// Get challan by ID
export const getChallan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const challan = await getChallanById(id);

    if (!challan) {
      return res.status(404).json({ success: false, message: "Challan not found" });
    }

    res.json({ success: true, data: { challan } });
  } catch (error) {
    console.error("Error fetching challan:", error);
    res.status(500).json({ success: false, message: "Failed to fetch challan" });
  }
};

// Get challans by vehicle id
export const getVehicleChallans = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      return res.status(400).json({ success: false, message: "Vehicle ID is required" });
    }

    const challans = await getChallansByVehicle(vehicleId);
    res.json({ success: true, data: { challans } });
  } catch (error) {
    console.error("Error fetching vehicle challans:", error);
    res.status(500).json({ success: false, message: "Failed to fetch challans" });
  }
};

// Get challans for authenticated user's vehicles
export const getMyChallans = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const challans = await getChallansByUser(user_id);
    res.json({ success: true, data: { challans } });
  } catch (error) {
    console.error("Error fetching user challans:", error);
    res.status(500).json({ success: false, message: "Failed to fetch challans" });
  }
};

// Dispute a challan (Citizen)
export const disputeAChallan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!reason) {
      return res.status(400).json({ success: false, message: "Dispute reason is required" });
    }

    const challan = await disputeChallan(id, reason);

    if (!challan) {
      return res.status(404).json({ success: false, message: "Challan not found or cannot be disputed" });
    }

    res.json({ success: true, message: "Challan disputed", data: { challan } });
  } catch (error) {
    console.error("Error disputing challan:", error);
    res.status(500).json({ success: false, message: "Failed to dispute challan" });
  }
};

// Resolve challan dispute (Admin)
export const resolveDispute = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution, new_status } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!resolution || !new_status) {
      return res.status(400).json({ success: false, message: "resolution and new_status are required" });
    }

    const validStatuses = ["UNPAID", "CANCELLED"];
    if (!validStatuses.includes(new_status)) {
      return res.status(400).json({ success: false, message: "new_status must be UNPAID or CANCELLED" });
    }

    const challan = await resolveChallanDispute(id, adminId, resolution, new_status);

    if (!challan) {
      return res.status(404).json({ success: false, message: "Challan not found or not in disputed status" });
    }

    // Get vehicle owner to notify
    const vehicleResult = await pool.query("SELECT owner_id FROM vehicles WHERE id = $1", [challan.vehicle_id]);
    if (vehicleResult.rows[0]) {
      await createNotification(vehicleResult.rows[0].owner_id, `Your challan dispute has been resolved: ${resolution}`);
    }

    res.json({ success: true, message: "Dispute resolved", data: { challan } });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    res.status(500).json({ success: false, message: "Failed to resolve dispute" });
  }
};
