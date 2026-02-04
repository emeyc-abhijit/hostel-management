import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/hostel-harmony",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "hostel_harmony_secret",
    expiry: process.env.JWT_EXPIRY || "7d",
  },
  cors: {
    origin: process.env.FRONTEND_URL || [
      "http://localhost:5173",
      "http://localhost:8080",
    ],
    credentials: true,
  },
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

export default config;
