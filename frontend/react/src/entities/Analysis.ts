/** Request payload sent to the MedCLIP image-analysis endpoint */
export interface AIAnalysisRequest {
  image: File;
  metadata: Record<string, unknown>;
}

/** Response from MedCLIP classification API */
export interface ClassificationResult {
  disease_name: string;
  score: number;
  best_phrase: string;
}

/** Response returned by the MedCLIP classifier */
export interface AIAnalysisResult {
  results: ClassificationResult[];
}
