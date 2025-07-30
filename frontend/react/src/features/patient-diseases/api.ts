import { http } from "../../lib/httpClient";
import { APP_CONFIG } from "../../config/constants";
import type {
  PatientDisease,
  AssignDiseaseBody,
} from "../../entities";

const PREFIX = `${APP_CONFIG.API_PREFIX}/patient-diseases`;

export const patientDiseasesApi = {
  // GET /patient-diseases/by-patient/:patient_id
  listByPatient: (patientId: number | string) =>
    http
      .get<PatientDisease[]>(`${PREFIX}/details/by-patient/${patientId}`)
      .then((r) => r.data),

  // POST /patient-diseases/assign
  assign: (data: AssignDiseaseBody) =>
    http
      .post<PatientDisease>(`${PREFIX}/assign`, data)
      .then((r) => r.data),

  // DELETE /patient-diseases/:link_id
  remove: (linkId: number | string) =>
    http.delete<void>(`${PREFIX}/${linkId}`),
};
