import { Router } from "express";
import { requireAuthentication } from "../middleware/authentication";
import { meController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/me", requireAuthentication, meController);

export default userRoutes;
