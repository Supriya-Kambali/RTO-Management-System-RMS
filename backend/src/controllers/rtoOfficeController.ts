import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createRtoOffice,
  getAllRtoOffices,
  getRtoOfficeById,
  updateRtoOffice,
  deleteRtoOffice,
} from "../models/rtoOfficeModel";

// Create a new RTO office (SUPER_ADMIN only)
export const addRtoOffice = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, state, district, address, phone, email } = req.body;

    if (!name || !code || !state || !district || !address) {
      return res.status(400).json({ success: false, message: "name, code, state, district, and address are required" });
    }

    const rtoOffice = await createRtoOffice(name, code, state, district, address, phone, email);
    res.status(201).json({ success: true, message: "RTO office created", data: { rtoOffice } });
  } catch (error) {
    console.error("Error creating RTO office:", error);
    res.status(500).json({ success: false, message: "Failed to create RTO office" });
  }
};

// List all RTO offices (all authenticated users)
export const listRtoOffices = async (req: AuthRequest, res: Response) => {
  try {
    const rtoOffices = await getAllRtoOffices();
    res.json({ success: true, data: { rtoOffices } });
  } catch (error) {
    console.error("Error fetching RTO offices:", error);
    res.status(500).json({ success: false, message: "Failed to fetch RTO offices" });
  }
};

// Get RTO office by ID
export const getRtoOffice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rtoOffice = await getRtoOfficeById(id);

    if (!rtoOffice) {
      return res.status(404).json({ success: false, message: "RTO office not found" });
    }

    res.json({ success: true, data: { rtoOffice } });
  } catch (error) {
    console.error("Error fetching RTO office:", error);
    res.status(500).json({ success: false, message: "Failed to fetch RTO office" });
  }
};

// Update RTO office (SUPER_ADMIN only)
export const editRtoOffice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;

    const rtoOffice = await updateRtoOffice(id, { name, address, phone, email });

    if (!rtoOffice) {
      return res.status(404).json({ success: false, message: "RTO office not found" });
    }

    res.json({ success: true, message: "RTO office updated", data: { rtoOffice } });
  } catch (error) {
    console.error("Error updating RTO office:", error);
    res.status(500).json({ success: false, message: "Failed to update RTO office" });
  }
};

// Delete RTO office (SUPER_ADMIN only)
export const removeRtoOffice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteRtoOffice(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "RTO office not found" });
    }

    res.json({ success: true, message: "RTO office removed" });
  } catch (error) {
    console.error("Error deleting RTO office:", error);
    res.status(500).json({ success: false, message: "Failed to delete RTO office" });
  }
};
