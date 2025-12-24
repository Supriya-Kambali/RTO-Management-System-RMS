import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

// Admin test controller
export const adminTest = (req: AuthRequest, res: Response) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
  });
};

// Officer test controller
export const officerTest = (req: AuthRequest, res: Response) => {
  res.json({
    message: "Officer access granted",
    user: req.user,
  });
};

// Citizen test controller
export const citizenTest = (req: AuthRequest, res: Response) => {
  res.json({
    message: "Citizen access granted",
    user: req.user,
  });
};
