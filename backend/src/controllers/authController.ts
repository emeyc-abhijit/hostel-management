import { Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest } from "../middleware/auth.js";

export const register = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      "Validation failed",
      JSON.stringify(errors.array()),
      400,
    );
  }

  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(
        res,
        "User already exists",
        "Email already registered",
        409,
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email, user.role);

    return sendSuccess(
      res,
      "User registered successfully",
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201,
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return sendError(res, "Registration failed", error.message, 500);
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      "Validation failed",
      JSON.stringify(errors.array()),
      400,
    );
  }

  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid credentials", "User not found", 401);
    }

    if (user.role !== role) {
      return sendError(
        res,
        "Invalid role",
        "Selected role does not match user role",
        401,
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", "Incorrect password", 401);
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    return sendSuccess(res, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return sendError(res, "Login failed", error.message, 500);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return sendError(res, "User not found", undefined, 404);
    }
    return sendSuccess(res, "User retrieved", user);
  } catch (error: any) {
    console.error("Get user error:", error);
    return sendError(res, "Failed to get user", error.message, 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, avatar },
      { new: true },
    ).select("-password");

    return sendSuccess(res, "Profile updated", user);
  } catch (error: any) {
    console.error("Update profile error:", error);
    return sendError(res, "Failed to update profile", error.message, 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, "User not found", undefined, 404);
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return sendError(res, "Invalid current password", undefined, 401);
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return sendSuccess(res, "Password changed successfully");
  } catch (error: any) {
    console.error("Change password error:", error);
    return sendError(res, "Failed to change password", error.message, 500);
  }
};
