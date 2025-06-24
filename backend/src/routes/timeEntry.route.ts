import { Router } from "express";
import {
  getTimeEntries,
  getTodayTimeEntry,
  resetTimers,
  startBreak,
  startWork,
  stopTimers,
} from "../controllers/timeEntry.controller";
import { requireAuthentication } from "../middleware/authentication";

const timeEntryRoutes = Router();

timeEntryRoutes.get(
  "/:projectId/today",
  requireAuthentication,
  getTodayTimeEntry
);
timeEntryRoutes.post(
  "/:projectId/start-work",
  requireAuthentication,
  startWork
);
timeEntryRoutes.post(
  "/:projectId/start-break",
  requireAuthentication,
  startBreak
);
timeEntryRoutes.post(
  "/:projectId/stop-timers",
  requireAuthentication,
  stopTimers
);
timeEntryRoutes.post(
  "/:projectId/reset-timers",
  requireAuthentication,
  resetTimers
);
timeEntryRoutes.get("/:projectId", requireAuthentication, getTimeEntries);

export default timeEntryRoutes;
