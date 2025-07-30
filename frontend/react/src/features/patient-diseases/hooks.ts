
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { patientDiseasesApi } from "./api";
import type {
  PatientDisease,
  AssignDiseaseBody,
} from "../../entities";
import { toast } from "../../hooks/use-toast";

export type PatientDiseaseItem =
  | PatientDisease & { disease_name?: string }
  | string;

/* ─────────── GET diseases of one patient ─────────── */
export const usePatientDiseases = (patientId?: number | string) =>
  useQuery<PatientDiseaseItem[]>({
    queryKey: ["patientDiseases", patientId],
    queryFn: () => patientDiseasesApi.listByPatient(patientId!),
    enabled: !!patientId,
  });

/* ─────────── ASSIGN disease to patient ─────────── */

export const useAssignDisease = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AssignDiseaseBody) =>
      patientDiseasesApi.assign(body),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["patientDiseases", vars.patient_id],
      });
      toast({ title: "Disease assigned successfully" });
    },

    onError: () =>
      toast({ title: "Error assigning disease", variant: "destructive" }),
  });
};

/* ─────────── REMOVE link ─────────── */
export const useRemoveDisease = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { linkId: number | string; patientId: number | string }) =>
      patientDiseasesApi.remove(p.linkId),

    onSuccess: (_data, p) => {
      qc.invalidateQueries({
        queryKey: ["patientDiseases", p.patientId],
      });
      toast({ title: "Disease removed from patient" });
    },

    onError: () =>
      toast({ title: "Error removing disease", variant: "destructive" }),
  });
};
