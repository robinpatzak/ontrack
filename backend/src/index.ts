import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(8000, () => {
  console.info("Server is running on http://localhost:8000");
});
