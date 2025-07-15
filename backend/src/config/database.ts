import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

const connectDatabase = async () => {
  console.info(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);

    console.info("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.info("Mongoose connected to the database");
});

mongoose.connection.on("error", (error) => {
  console.error("Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.info("Mongoose disconnected from the database");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.info("Mongoose connection closed due to application termination");
  process.exit(0);
});

export default connectDatabase;
