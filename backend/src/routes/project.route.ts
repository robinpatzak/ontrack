import { Router } from "express";
import { requireAuthentication } from "../middleware/authentication";
import {
  createProjectController,
  getProjectController,
  listProjectsController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/", requireAuthentication, createProjectController);
projectRoutes.get("/", requireAuthentication, listProjectsController);
projectRoutes.get("/:id", requireAuthentication, getProjectController);

export default projectRoutes;
