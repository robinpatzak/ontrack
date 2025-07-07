import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  listProjectsController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/", createProjectController);
projectRoutes.get("/", listProjectsController);
projectRoutes.get("/:id", getProjectController);

export default projectRoutes;
