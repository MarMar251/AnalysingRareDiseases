import { http } from "../../lib/httpClient";
import { APP_CONFIG } from "../../config/constants";
import type { User, NewUser } from "../../entities";
import { authHeader } from "../auth/helpers";
import type { UpdateUser } from "../../entities";

const PREFIX = `${APP_CONFIG.API_PREFIX}/users`;

export const usersApi = {
  list: () => http.get<User[]>(PREFIX).then((r) => r.data),

  create: (data: NewUser) =>
    http
      .post<User>(`${PREFIX}/register`, data, { headers: authHeader() })
      .then((r) => r.data),

  update: (id: number, data: UpdateUser) =>
    http
      .put<User>(`${PREFIX}/${id}`, data, { headers: authHeader() })
      .then((r) => r.data),

  remove: (id: number) =>
    http.delete<void>(`${PREFIX}/${id}`, { headers: authHeader() }),

  getById: (id: number) =>
    http.get<User>(`${PREFIX}/${id}`).then((r) => r.data),

  getDoctors: () =>
  http
    .get<User[]>(`${PREFIX}/doctors`, { headers: authHeader() })
    .then((r) => r.data),
};
