import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDatabase from "./config/database";
import { API_VERSION, CLIENT_URL, PORT } from "./config/env";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import projectRoutes from "./routes/project.route";
import timeEntryRoutes from "./routes/timeEntry.route";

const app = express();

connectDatabase();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
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
router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/time-entries", timeEntryRoutes);

app.use("/api/v0", router);

app.listen(8000, () => {
  console.info(`API is running on http://localhost:${PORT}/api/${API_VERSION}`);
});
