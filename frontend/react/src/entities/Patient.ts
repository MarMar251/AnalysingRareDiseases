import { GenderEnum } from "./enums";

/** Shape returned by the API – always has id */
export interface Patient {
  id: number;
  full_name: string;
  /** ISO-8601 date (YYYY-MM-DD) */
  birth_date: string;
  phone_number?: string;
  gender?: GenderEnum;
  created_by?: number;
}

/** Payload sent to POST /patients (no id yet) */
export type NewPatient = Omit<Patient, "id">;
export type UpdatePatient = Omit<Patient,"id"|"created_by">