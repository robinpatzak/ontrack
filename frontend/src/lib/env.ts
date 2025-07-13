const getEnvVariable = (key: string, defaultValue?: string): string => {
  if (!key.startsWith("VITE_")) {
    console.warn(
      `Environment variable ${key} does not start with "VITE_". This may not be accessible in the frontend.`
    );
  }

  const value = import.meta.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }

  return value;
};

export const BACKEND_BASE_URL = getEnvVariable("VITE_BACKEND_BASE_URL", "http://localhost");
export const BACKEND_PORT = getEnvVariable("VITE_BACKEND_PORT", "8000");
