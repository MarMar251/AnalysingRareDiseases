import { http } from "../../lib/httpClient";
import { APP_CONFIG } from "../../config/constants";
import { authHeader } from "../auth/helpers";
import type { AIAnalysisResult, AIHistoryItem } from "../../entities";

const PREFIX = `${APP_CONFIG.API_PREFIX}/classification`;

export const aiApi = {
  // Send an image for classification
  classify: (formData: FormData, onUploadProgress?: (progressEvent: any) => void) =>
    http.post<AIAnalysisResult>(
      `${PREFIX}/classify`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader()
        },
        timeout: 70000,
        onUploadProgress
      }
    ).then(r => r.data),
  
  // Get history of classifications
  getHistory: () =>
    http.get<AIHistoryItem[]>(`${PREFIX}/history`, {
      headers: authHeader()
    }).then(r => r.data),
  
  // Get a specific classification by ID
  getById: (id: number) =>
    http.get<AIAnalysisResult>(`${PREFIX}/${id}`, {
      headers: authHeader()
    }).then(r => r.data),
  
  // Delete a classification from history
  delete: (id: number) =>
    http.delete<void>(`${PREFIX}/${id}`, {
      headers: authHeader()
    })
};