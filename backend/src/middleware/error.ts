import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${status}: ${message}`, err.details);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { details: err.details }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
