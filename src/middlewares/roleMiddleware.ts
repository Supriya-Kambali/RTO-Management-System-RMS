import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

// Supported roles
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  RTO_ADMIN: "RTO_ADMIN",
  RTO_OFFICER: "RTO_OFFICER",
  CITIZEN: "CITIZEN",
  POLICE: "POLICE",
  AUDITOR: "AUDITOR",
};

// Middleware to check if user has one of the allowed roles
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access forbidden: insufficient role" });
    }

    next();
  };
};
