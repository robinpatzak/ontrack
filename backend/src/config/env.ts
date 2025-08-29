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
export const BACKEND_PORT = getEnvVariable("BACKEND_PORT", "8000");
export const MONGODB_URI = getEnvVariable(
  "MONGODB_URI",
  "mongodb://ontrack_db:27017/ontrack"
);
export const FRONTEND_BASE_URL = getEnvVariable(
  "FRONTEND_BASE_URL",
  "http://localhost"
);
export const FRONTEND_PORT = getEnvVariable("FRONTEND_PORT", "3000");

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
