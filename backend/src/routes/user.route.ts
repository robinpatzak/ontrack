import { Router } from "express";
import { meController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/me", meController);

export default userRoutes;
