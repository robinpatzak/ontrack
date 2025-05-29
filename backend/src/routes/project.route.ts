import { Router } from "express";
import { requireAuthentication } from "../middleware/authentication";
import {
  createProjectController,
  listProjectsController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/", requireAuthentication, createProjectController);
projectRoutes.get("/", requireAuthentication, listProjectsController);

export default projectRoutes;
