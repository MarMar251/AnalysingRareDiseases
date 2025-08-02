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

http.interceptors.response.use(
  response => response,
  error => {
    let message = "An unexpected error occurred.";
    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response) {
      switch (error.response.status) {
        case 400:
          message = "Bad request. Please check your input.";
          break;
        case 401:
          message = "You are not authorized. Please log in.";
          break;
        case 403:
          message = "You do not have permission to perform this action.";
          break;
        case 404:
          message = "The requested resource was not found.";
          break;
        case 500:
          message = "A server error occurred. Please try again later.";
          break;
      }
    }
    error.userMessage = message;
    return Promise.reject(error);
  }
);
