import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

// Supported roles
export const ROLES = {
  ADMIN: "ADMIN",
  OFFICER: "OFFICER",
  CITIZEN: "CITIZEN",
};

// Middleware to check if user has one of the allowed roles
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }

    next();
  };
};
