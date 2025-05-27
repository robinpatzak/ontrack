import express from "express";
import { API_VERSION, PORT } from "./config/env";
import { authRoutes } from "./routes";
import connectDatabase from "./config/database";

const app = express();

connectDatabase();

app.use(express.json());

const router = express.Router();

router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

app.use("/api/v0", router);

app.listen(8000, () => {
  console.info(`API is running on http://localhost:${PORT}/api/${API_VERSION}`);
});
