import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import config from "./config/index.js";

// Routes
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import hostelRoutes from "./routes/hostels.js";
import roomRoutes from "./routes/rooms.js";
import applicationRoutes from "./routes/applications.js";
import complaintRoutes from "./routes/complaints.js";
import noticeRoutes from "./routes/notices.js";
import feeRoutes from "./routes/fees.js";
import attendanceRoutes from "./routes/attendance.js";

// Middleware
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(config.cors));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/attendance", attendanceRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (should be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${config.env}`);
});

export default app;
