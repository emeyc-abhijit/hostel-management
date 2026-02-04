import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (
  userId: string,
  email: string,
  role: string,
): string => {
  return jwt.sign({ userId, email, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
