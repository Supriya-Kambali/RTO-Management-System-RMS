import dotenv from "dotenv";
// Load environment variables FIRST before any other imports
dotenv.config();

// Allow self-signed certificates for Aiven PostgreSQL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // Import the cors middleware
import healthRoutes from "./routes/healthRoutes";
import roleTestRoutes from "./routes/roleTestRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import rtoOfficeRoutes from "./routes/rtoOfficeRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import dlApplicationRoutes from "./routes/dlApplicationRoutes";
import drivingLicenseRoutes from "./routes/drivingLicenseRoutes";
import challanRoutes from "./routes/challanRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import { connectDB } from "./db";
import { verifyEmailConnection } from "./utils/emailService";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use(roleTestRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(rtoOfficeRoutes);
app.use(vehicleRoutes);
app.use(dlApplicationRoutes);
app.use(drivingLicenseRoutes);
app.use(challanRoutes);
app.use(paymentRoutes);
app.use(appointmentRoutes);
app.use(notificationRoutes);
app.use(analyticsRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Connect to database, then start server
const startServer = async () => {
  await connectDB();
  
  // Verify email service configuration
  await verifyEmailConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
