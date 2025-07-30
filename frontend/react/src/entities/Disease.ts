export interface Disease {
  id: number;
  name: string;
  description: string;
  created_by: number;
  /** ISO-8601 timestamp (`YYYY-MM-DDTHH:mm:ssZ`) */
  created_at?: string;
}

/** Payload sent to POST / (no id or created_by yet) */
export type NewDisease = Omit<Disease, 'id' | 'created_by'>;
