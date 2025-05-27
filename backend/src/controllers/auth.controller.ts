import { Request, Response } from "express";
import authService from "../services/auth.service";

const registerController = async (req: Request, res: Response) => {
  try {
    // TODO: Validate request body

    const { user } = await authService.registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
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

const loginController = async (req: Request, res: Response) => {
  try {
    //TODO: Validate request body

    const { user } = await authService.loginService(req.body);

    res.status(200).json({
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

export default { registerController, loginController };
