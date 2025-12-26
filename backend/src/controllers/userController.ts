import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUserProfile,
  deleteUser,
} from "../models/userModel";
import { ROLES } from "../middlewares/roleMiddleware";

// Get all users (SUPER_ADMIN only)
export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: { users } });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Get user by ID (Admin)
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// Update user (Admin)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const allowedStatuses = ["ACTIVE", "BLOCKED", "SUSPENDED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await updateUserStatus(id, status);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", data: { user } });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// Delete user (SUPER_ADMIN only - soft delete)
export const removeUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User disabled successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Assign role to user (SUPER_ADMIN only)
export const assignRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role, rtoOfficeId } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ success: false, message: "userId and role are required" });
    }

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await updateUserRole(userId, role, rtoOfficeId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Role assigned successfully", data: { user } });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ success: false, message: "Failed to assign role" });
  }
};

// Get logged-in user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// Update logged-in user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, address, date_of_birth, aadhaar_number } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await updateUserProfile(userId, { name, phone, address, date_of_birth, aadhaar_number});

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated", data: { user } });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// Legacy: Update user status (kept for backward compatibility)
export const changeUserStatus = async (req: AuthRequest, res: Response) => {
  return updateUser(req, res);
};
