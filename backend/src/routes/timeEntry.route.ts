import { Router } from "express";
import {
  addTimeEntry,
  getTimeEntries,
  getTodayTimeEntry,
  resetTimers,
  startBreak,
  startWork,
  stopTimers,
} from "../controllers/timeEntry.controller";

const timeEntryRoutes = Router();

timeEntryRoutes.get("/:projectId/today", getTodayTimeEntry);
timeEntryRoutes.post("/:projectId/start-work", startWork);
timeEntryRoutes.post("/:projectId/start-break", startBreak);
timeEntryRoutes.post("/:projectId/stop-timers", stopTimers);
timeEntryRoutes.post("/:projectId/reset-timers", resetTimers);
timeEntryRoutes.get("/:projectId", getTimeEntries);
timeEntryRoutes.post("/:projectId/add-time-entry", addTimeEntry);

export default timeEntryRoutes;
