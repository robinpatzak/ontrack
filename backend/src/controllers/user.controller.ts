import { Request, Response } from "express";

export const meController = async (req: Request, res: Response) => {
  try {
    // Assuming req.user is populated by the authentication middleware
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error in meController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
