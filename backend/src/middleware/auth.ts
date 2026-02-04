import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export interface AuthRequest extends ExpressRequest {
  userId?: string;
  role?: string;
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const adminOrWarden = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.role !== "admin" && req.role !== "warden") {
    return res.status(403).json({ message: "Admin or Warden access required" });
  }
  next();
};
