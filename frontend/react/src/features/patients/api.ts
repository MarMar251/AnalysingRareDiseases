import { http } from "../../lib/httpClient";
import { APP_CONFIG } from "../../config/constants";
import { authHeader } from "../../features/auth/helpers";
import type { NewPatient, Patient, UpdatePatient } from "../../entities";

const PREFIX = `${APP_CONFIG.API_PREFIX}/patients`;

export const patientsApi = {
  list: () => http.get<Patient[]>(PREFIX).then(r => r.data),
  
  create: (data: NewPatient) =>
    http.post<Patient>(PREFIX, data, { headers: authHeader() })
      .then(r => r.data),
      
  update: (id: number, data: UpdatePatient) =>
    http.put<Patient>(`${PREFIX}/${id}`, data, { headers: authHeader() })
      .then(r => r.data),
      
  remove: (id: number) =>
    http.delete<void>(`${PREFIX}/${id}`, { headers: authHeader() }),
    
  getById: (id: number) =>
    http.get<Patient>(`${PREFIX}/${id}`).then(r => r.data),
};
