import dotenv from "dotenv";

dotenv.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnvVariable("NODE_ENV");
export const API_VERSION = getEnvVariable("API_VERSION");
export const PORT = getEnvVariable("PORT");
export const MONGODB_URI = getEnvVariable("MONGODB_URI");
export const CLIENT_URL = getEnvVariable("CLIENT_URL");
export const JWT_ACCESS_SECRET = getEnvVariable("JWT_ACCESS_SECRET");
export const JWT_ACCESS_EXPIRES_IN = getEnvVariable("JWT_ACCESS_EXPIRES_IN");
export const JWT_REFRESH_SECRET = getEnvVariable("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES_IN = getEnvVariable("JWT_REFRESH_EXPIRES_IN");
