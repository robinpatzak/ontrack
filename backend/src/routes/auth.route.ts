import { Router } from "express";
import { authController } from "../controllers";

const authRoutes = Router();

authRoutes.post("/register", authController.registerController);
authRoutes.post("/login", authController.loginController);

export default authRoutes;
