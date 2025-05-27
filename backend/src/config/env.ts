import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
};

export const API_VERSION = getEnvVariable("API_VERSION");
export const PORT = getEnvVariable("PORT");
export const MONGODB_URI = getEnvVariable("MONGODB_URI");
