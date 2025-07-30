import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diseasesApi } from './api';
import type { NewDisease } from './api';
import type { Disease } from '../../entities';

export const useDiseases = (skip = 0, limit = 10) =>
  useQuery<Disease[]>({
    queryKey: ['diseases', skip, limit],
    queryFn: () => diseasesApi.list(skip, limit),
  });

export const useDisease = (id?: number | string) =>
  useQuery<Disease>({
    queryKey: ['diseases', id],
    queryFn: () => diseasesApi.getById(id!),
    enabled: !!id,
  });

export const useCreateDisease = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: diseasesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diseases'] }),
  });
};

export const useUpdateDiseaseDescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: number | string; description: string }) =>
      diseasesApi.updateDescription(p.id, p.description),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['diseases'] });
      qc.invalidateQueries({ queryKey: ['diseases', vars.id] });
    },
  });
};