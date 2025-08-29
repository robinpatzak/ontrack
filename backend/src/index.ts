import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDatabase from "./config/database";
import { BACKEND_PORT, FRONTEND_BASE_URL, FRONTEND_PORT } from "./config/env";
import { requireAuthentication } from "./middleware/authentication";
import authRoutes from "./routes/auth.route";
import projectRoutes from "./routes/project.route";
import timeEntryRoutes from "./routes/timeEntry.route";
import userRoutes from "./routes/user.route";

const app = express();

connectDatabase();

app.use(
  cors({ origin: `${FRONTEND_BASE_URL}:${FRONTEND_PORT}`, credentials: true })
);
app.use(cookieParser());
app.use(express.json());

const router = express.Router();

router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/user", requireAuthentication, userRoutes);
router.use("/project", requireAuthentication, projectRoutes);
router.use("/time-entries", requireAuthentication, timeEntryRoutes);

app.use("/api/v1", router);

app.listen(parseInt(BACKEND_PORT, 10), "0.0.0.0", () => {
  console.info(
    `API is running on http://0.0.0.0:${BACKEND_PORT}/api`
  );
});
