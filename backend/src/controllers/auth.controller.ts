import { Request, Response } from "express";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  NODE_ENV,
} from "../config/env";
import { loginUser, registerUser } from "../services/auth.service";
import { z } from "zod";
import ms, { StringValue } from "ms";
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

    const { user } = await registerUser(validatedBody);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
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

    const { user, accessToken, refreshToken } = await loginUser(validatedBody);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: ms(JWT_ACCESS_EXPIRES_IN as StringValue),
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: ms(JWT_REFRESH_EXPIRES_IN as StringValue),
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user,
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
        sameSite: "strict",
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
