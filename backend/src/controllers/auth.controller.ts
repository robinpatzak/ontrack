import { Request, Response } from "express";
import ms, { StringValue } from "ms";
import { z } from "zod";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  NODE_ENV,
} from "../config/env";
import User from "../models/User";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt";

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8),
});

export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedBody = registerSchema.parse(req.body);
    const { email, firstName, lastName, password } = validatedBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await User.create({ email, firstName, lastName, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.omitPassword(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedBody = loginSchema.parse(req.body);
    const { email, password } = validatedBody;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokenPair({
      userId: user._id,
      email: user.email,
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: ms(JWT_ACCESS_EXPIRES_IN as StringValue),
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: ms(JWT_REFRESH_EXPIRES_IN as StringValue),
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: user.omitPassword(),
      });
  } catch (error) {
    console.error("Error in loginController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token missing",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { userId, email } = payload;
    const { accessToken } = generateTokenPair({ userId, email });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: ms(JWT_ACCESS_EXPIRES_IN as StringValue),
      })
      .status(200)
      .json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
      });
  } catch (error) {
    console.error("Error in refreshController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};

export const logoutController = async (_: Request, res: Response) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "lax",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Error in logoutController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
