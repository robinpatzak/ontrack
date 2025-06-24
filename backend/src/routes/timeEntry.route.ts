import { Router } from "express";
import { requireAuthentication } from "../middleware/authentication";
import {
  getTimeEntries,
  getTodayTimeEntry,
  startBreak,
  startWork,
  stopTimers,
} from "../controllers/timeEntry.controller";

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
timeEntryRoutes.get("/:projectId", requireAuthentication, getTimeEntries);

export default timeEntryRoutes;
