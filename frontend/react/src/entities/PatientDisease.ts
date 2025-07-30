/** Mirrors domain.entities.patient_disease.PatientDisease */
export interface PatientDisease {
  id?: number;
  patient_id: number;
  disease_id: number;
  assigned_by: number;
  assigned_at: string;
}