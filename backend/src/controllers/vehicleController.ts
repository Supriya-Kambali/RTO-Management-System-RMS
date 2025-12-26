import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  registerVehicle,
  getAllVehicles,
  getVehicleById,
  getVehiclesByOwner,
  verifyVehicle,
  approveVehicle,
  createVehicleTransfer,
  approveVehicleTransfer,
  scrapVehicle,
} from "../models/vehicleModel";
import { createNotification } from "../models/notificationModel";

// Register a new vehicle (Citizen)
export const registerNewVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { vehicle_type, make, model, year, color, engine_number, chassis_number, fuel_type, rto_office_id } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!vehicle_type || !make || !model || !year || !color || !engine_number || !chassis_number || !fuel_type || !rto_office_id) {
      return res.status(400).json({ success: false, message: "All vehicle details are required" });
    }

    const vehicle = await registerVehicle(userId, vehicle_type, make, model, year, color, engine_number, chassis_number, fuel_type, rto_office_id);
    res.status(201).json({ success: true, message: "Vehicle registration submitted", data: { vehicle } });
  } catch (error) {
    console.error("Error registering vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to register vehicle" });
  }
};

// List all vehicles (Admin)
export const listVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const vehicles = await getAllVehicles();
    res.json({ success: true, data: { vehicles } });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vehicles" });
  }
};

// Get vehicle by ID
export const getVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.json({ success: true, data: { vehicle } });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vehicle" });
  }
};

// Get my vehicles (Citizen)
export const getMyVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const vehicles = await getVehiclesByOwner(userId);
    res.json({ success: true, data: { vehicles } });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vehicles" });
  }
};

// Verify vehicle documents (Officer)
export const verifyVehicleDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const officerId = req.user?.id;

    if (!officerId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ success: false, message: "Invalid vehicle ID format" });
    }

    const vehicle = await verifyVehicle(id, officerId);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not in pending status" });
    }

    await createNotification(vehicle.owner_id, "Your vehicle documents have been verified");

    res.json({ success: true, message: "Vehicle verified", data: { vehicle } });
  } catch (error) {
    console.error("Error verifying vehicle:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to verify vehicle" });
  }
};

// Approve vehicle registration (RTO_ADMIN)
export const approveVehicleRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { registration_number } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!registration_number) {
      return res.status(400).json({ success: false, message: "Registration number is required" });
    }

    const vehicle = await approveVehicle(id, adminId, registration_number);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not verified yet" });
    }

    await createNotification(vehicle.owner_id, `Your vehicle has been registered with number: ${registration_number}`);

    res.json({ success: true, message: "Vehicle registration approved", data: { vehicle } });
  } catch (error) {
    console.error("Error approving vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to approve vehicle" });
  }
};

// Transfer vehicle ownership (Citizen)
export const transferOwnership = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { to_user_id } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!to_user_id) {
      return res.status(400).json({ success: false, message: "New owner ID is required" });
    }

    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    if (vehicle.owner_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to transfer this vehicle" });
    }

    const transfer = await createVehicleTransfer(id, userId, to_user_id);
    res.status(201).json({ success: true, message: "Transfer request submitted", data: { transfer } });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ success: false, message: "Failed to create transfer request" });
  }
};

// Mark vehicle as scrapped (Admin)
export const markVehicleScrapped = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await scrapVehicle(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    await createNotification(vehicle.owner_id, `Your vehicle ${vehicle.registration_number} has been marked as scrapped`);

    res.json({ success: true, message: "Vehicle marked as scrapped", data: { vehicle } });
  } catch (error) {
    console.error("Error scrapping vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to scrap vehicle" });
  }
};
