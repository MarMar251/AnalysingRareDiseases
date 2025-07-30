import { http } from '../../lib/httpClient';
import { APP_CONFIG } from '../../config/constants';
import type { Disease } from '../../entities';

export type NewDisease = Omit<Disease, 'id' | 'created_by'>;

const PREFIX = `${APP_CONFIG.API_PREFIX}/diseases`;

export const diseasesApi = {
  list: (skip = 0, limit = 10) =>
    http.get<Disease[]>(`${PREFIX}?skip=${skip}&limit=${limit}`).then(r => r.data),

  getById: (id: number | string) =>
    http.get<Disease>(`${PREFIX}/${id}`).then(r => r.data),

  create: (payload: NewDisease) =>
    http.post<Disease>(PREFIX, payload).then(r => r.data),

  updateDescription: (id: number | string, description: string) =>
    http.put<Disease>(`${PREFIX}/${id}/description`, { description }).then(r => r.data),

};
