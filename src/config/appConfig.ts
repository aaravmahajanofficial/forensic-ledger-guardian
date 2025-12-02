
const validateEnv = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.warn(
      'VITE_BACKEND_URL is not set. Defaulting to http://localhost:4000. Set VITE_BACKEND_URL in your .env file for production.'
    );
    return 'http://localhost:4000';
  }
  return backendUrl;
};

export const appConfig = {
  backendUrl: validateEnv()
};
