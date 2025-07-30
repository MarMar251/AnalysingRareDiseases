/**
 * Result for a single disease classification
 */
export interface ClassificationResult {
  disease_name: string;
  score: number;
  best_phrase: string;
}

/**
 * Complete result returned from the AI classification API
 */
export interface AIAnalysisResult {
  results: ClassificationResult[];
}

/**
 * History item for past AI analyses
 */
export interface AIHistoryItem {
  id: number;
  disease_name: string;
  score: number;
  image_path: string;
  created_at: string;
  user_id: number;
}