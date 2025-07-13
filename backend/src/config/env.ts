import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnvVariable("NODE_ENV", "production");
export const PORT = getEnvVariable("PORT", "8000");
export const MONGODB_URI = getEnvVariable(
  "MONGODB_URI",
  "mongodb://localhost:27017/ontrack"
);
export const CLIENT_URL = getEnvVariable("CLIENT_URL", "http://localhost:5173");

export const JWT_ACCESS_SECRET = getEnvVariable("JWT_ACCESS_SECRET");
export const JWT_ACCESS_EXPIRES_IN = getEnvVariable(
  "JWT_ACCESS_EXPIRES_IN",
  "15m"
);
export const JWT_REFRESH_SECRET = getEnvVariable("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES_IN = getEnvVariable(
  "JWT_REFRESH_EXPIRES_IN",
  "7d"
);
