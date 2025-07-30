/** Application-wide constants */
/** Global constants shared across the application */
export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  API_PREFIX  : "/api/v1",
  TOKEN_STORAGE_KEY: "token",    
};


/** Home path for each user role */
export const ROLE_HOME: Record<string, string> = {
  admin : "/admin/overview",
  doctor: "/doctor",
  nurse : "/nurse",
};
