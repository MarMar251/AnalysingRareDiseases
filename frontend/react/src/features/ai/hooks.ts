import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "./api";
import type { AIAnalysisResult } from "../../entities";

// Key factory for React Query
const keys = {
  all: ['ai'] as const,
  history: () => [...keys.all, 'history'] as const,
  detail: (id: number) => [...keys.all, id] as const,
};

// Hook to fetch AI analysis history
export const useAIHistory = () => {
  return useQuery({
    queryKey: keys.history(),
    queryFn: () => aiApi.getHistory(),
  });
};

// Hook to fetch a specific AI analysis by ID
export const useAIDetail = (id: number) => {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => aiApi.getById(id),
    enabled: !!id,
  });
};

// Hook to perform an AI classification
export const useClassifyImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      formData: FormData;
      onUploadProgress?: (progressEvent: any) => void;
    }) => aiApi.classify(params.formData, params.onUploadProgress),
    onSuccess: () => {
      // Invalidate the history query to refetch when a new analysis is done
      queryClient.invalidateQueries({ queryKey: keys.history() });
    },
  });
};

// Hook to delete an AI analysis from history
export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => aiApi.delete(id),
    onSuccess: () => {
      // Invalidate the history query to refetch after deletion
      queryClient.invalidateQueries({ queryKey: keys.history() });
    },
  });
};