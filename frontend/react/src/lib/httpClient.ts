import axios from "axios";
import { APP_CONFIG } from "../config/constants";
import { tokenService } from "../features/auth/tokenService";

/* Axios instance shared by every API file */
export const http = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 15_000,
});

/* Inject Authorization header automatically */
http.interceptors.request.use((cfg) => {
  const token = tokenService.get();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
