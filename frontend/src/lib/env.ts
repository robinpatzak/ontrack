const getEnvVariable = (key: string): string => {
  if (!key.startsWith("VITE_")) {
    console.warn(
      `Environment variable ${key} does not start with "VITE_". This may not be accessible in the frontend.`
    );
  }

  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
};

export const API_BASE_URL = getEnvVariable("VITE_API_BASE_URL");
export const API_PORT = getEnvVariable("VITE_API_PORT");
export const API_VERSION = getEnvVariable("VITE_API_VERSION");
