import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createDlApplication,
  getAllDlApplications,
  getDlApplicationById,
  getDlApplicationsByUser,
  verifyDlApplication,
  scheduleDrivingTest,
} from "../models/dlApplicationModel";
import { createNotification } from "../models/notificationModel";

// Apply for a driving license (Citizen)
export const applyForDl = async (req: AuthRequest, res: Response) => {
  try {
    const { rto_office_id, license_type } = req.body;
    const user_id = req.user?.id;

    if (!rto_office_id) {
      return res.status(400).json({ success: false, message: "rto_office_id is required" });
    }

    if (!user_id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const application = await createDlApplication(user_id, rto_office_id, license_type);
    res.status(201).json({ success: true, message: "DL application submitted", data: { application } });
  } catch (error) {
    console.error("Error creating DL application:", error);
    res.status(500).json({ success: false, message: "Failed to submit DL application" });
  }
};

// View all DL applications (Admin)
export const viewAllDlApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await getAllDlApplications();
    res.json({ success: true, data: { applications } });
  } catch (error) {
    console.error("Error fetching DL applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch DL applications" });
  }
};

// Get DL application by ID
export const getDlApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await getDlApplicationById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, data: { application } });
  } catch (error) {
    console.error("Error fetching DL application:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application" });
  }
};

// Get my DL applications (Citizen)
export const getMyDlApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const applications = await getDlApplicationsByUser(userId);
    res.json({ success: true, data: { applications } });
  } catch (error) {
    console.error("Error fetching DL applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

// Verify DL application documents (Officer)
export const verifyDlDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const officerId = req.user?.id;

    if (!officerId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const application = await verifyDlApplication(id, officerId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found or not in pending status" });
    }

    await createNotification(application.user_id, "Your DL application documents have been verified");

    res.json({ success: true, message: "Documents verified", data: { application } });
  } catch (error) {
    console.error("Error verifying documents:", error);
    res.status(500).json({ success: false, message: "Failed to verify documents" });
  }
};

// Schedule driving test (Admin)
export const scheduleTest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { test_date } = req.body;

    if (!test_date) {
      return res.status(400).json({ success: false, message: "test_date is required" });
    }

    const application = await scheduleDrivingTest(id, new Date(test_date));

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found or not verified yet" });
    }

    await createNotification(application.user_id, `Your driving test has been scheduled for ${test_date}`);

    res.json({ success: true, message: "Test scheduled", data: { application } });
  } catch (error) {
    console.error("Error scheduling test:", error);
    res.status(500).json({ success: false, message: "Failed to schedule test" });
  }
};
