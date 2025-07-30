import { http } from "../../lib/httpClient";
import { APP_CONFIG } from "../../config/constants";
import type { User } from "../../entities";
import { tokenService } from "./tokenService";


const PREFIX = `${APP_CONFIG.API_PREFIX}/users`;

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_at?: string; 
  user?: User;  
}


const authHeader = () => {
  const token = tokenService.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authApi = {
  /** POST /api/v1/users/login */
  login: (payload: LoginPayload) =>
    http
      .post<LoginResponse>(`${PREFIX}/login`, payload)
      .then((r) => {
        tokenService.set(r.data.access_token);
        return r.data;
      }),

  /** GET /api/v1/users/{id} – protected route */
  me: (userId: number) =>
    http
      .get<User>(`${PREFIX}/${userId}`, { headers: authHeader() })
      .then((r) => r.data),

  /* POST /api/v1/users/register (admin-only) */
  register: (
    payload: Omit<User, "id" | "role"> & { password: string; role?: string },
  ) => http.post<User>(`${PREFIX}/register`, payload).then((r) => r.data),

  /* POST /api/v1/users/logout – server-side revoke + client cleanup */
  logout: async () => {
    // Send the token so the server can blacklist its jti
    await http.post<void>(`${PREFIX}/logout`, null, {
      headers: authHeader(),
    });
    // Remove token locally
    tokenService.clear();
  },
};
