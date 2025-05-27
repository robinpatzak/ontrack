import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/env";
import User from "../models/User";

export const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token missing",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: string;
      email: string;
    };
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
      timestamp: new Date().toISOString(),
    });
  }
};
