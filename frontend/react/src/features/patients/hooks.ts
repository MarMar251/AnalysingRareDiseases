// src/features/patients/hooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { patientsApi } from "../patients/api";
import type { Patient, NewPatient, UpdatePatient } from "../../entities";
import { toast } from "../../hooks/use-toast";

const PATIENTS_QK: QueryKey = ["patients"];

/* ----- List patients ----- */
export const usePatients = () =>
  useQuery<Patient[]>({ queryKey: PATIENTS_QK, queryFn: patientsApi.list });

/* ----- Single patient ----- */
export const usePatient = (id: number, enabled = true) =>
  useQuery<Patient>({
    queryKey: [...PATIENTS_QK, id],
    queryFn: () => patientsApi.getById(id),
    enabled,
  });

/* ----- CREATE (nurse) ----- */
export const useCreatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewPatient) => patientsApi.create(payload),
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: PATIENTS_QK });
      toast({ title: "Patient created", description: saved.full_name });
    },
    onError: () =>
      toast({ title: "Error creating patient", variant: "destructive" }),
  });
};

/* ----- UPDATE (nurse) ----- */
export const useUpdatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatient }) =>
      patientsApi.update(id, data),
    onSuccess: (_, { id, data }) => {
      qc.setQueryData<Patient[]>(PATIENTS_QK, (old) =>
        old?.map((p) => (p.id === id ? { ...p, ...data } : p)),
      );
      qc.invalidateQueries({ queryKey: [...PATIENTS_QK, id] });
      toast({ title: "Patient updated" });
    },
    onError: () =>
      toast({ title: "Error updating patient", variant: "destructive" }),
  });
};

/* ----- DELETE (nurse) ----- */
export const useDeletePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientsApi.remove(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Patient[]>(PATIENTS_QK, (old) =>
        old?.filter((p) => p.id !== id),
      );
      toast({ title: "Patient deleted" });
    },
  });
};