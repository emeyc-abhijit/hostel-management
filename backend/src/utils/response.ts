import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  error?: string,
  statusCode: number = 400,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export const sendPaginatedResponse = <T>(
  res: Response,
  message: string,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200,
): Response => {
  const totalPages = Math.ceil(total / limit);
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
};
