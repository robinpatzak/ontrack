import { Router } from "express";
import { authController } from "../controllers";

const authRoutes = Router();

authRoutes.post("/register", authController.registerController);

export default authRoutes;
