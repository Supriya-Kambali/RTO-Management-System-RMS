import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  getDashboardStats,
  getRevenueAnalytics,
  getViolationAnalytics,
  getRiskAssessment,
} from "../models/analyticsModel";

// Get dashboard statistics
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: { stats } });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics" });
  }
};

// Get revenue analytics
export const getRevenue = async (req: AuthRequest, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    const revenue = await getRevenueAnalytics(
      start_date as string | undefined,
      end_date as string | undefined
    );
    res.json({ success: true, data: { revenue } });
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch revenue analytics" });
  }
};

// Get violation analytics
export const getViolations = async (req: AuthRequest, res: Response) => {
  try {
    const violations = await getViolationAnalytics();
    res.json({ success: true, data: { violations } });
  } catch (error) {
    console.error("Error fetching violation analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch violation analytics" });
  }
};

// Get ML risk assessment
export const getMlRiskAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const riskAssessments = await getRiskAssessment(limit);
    res.json({ success: true, data: { risk_assessments: riskAssessments } });
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    res.status(500).json({ success: false, message: "Failed to fetch risk assessment" });
  }
};
