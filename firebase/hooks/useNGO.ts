import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NGOService, { NGOData } from '../services/NGOService';

// Hook to get NGO by ID
export const useNGO = (ngoId: string | null | undefined) => {
  return useQuery({
    queryKey: ['ngo', ngoId],
    queryFn: () => (ngoId ? NGOService.getNGO(ngoId) : null),
    enabled: !!ngoId,
  });
};

// Hook to get all NGOs
export const useAllNGOs = () => {
  return useQuery({
    queryKey: ['ngos'],
    queryFn: () => NGOService.getAllNGOs(),
  });
};

// Hook to get NGOs by status
export const useNGOsByStatus = (status: 'pending' | 'approved' | 'rejected') => {
  return useQuery({
    queryKey: ['ngos', status],
    queryFn: () => NGOService.getNGOsByStatus(status),
  });
};

// Hook to create NGO
export const useCreateNGO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      ngoId, 
      ngoData 
    }: { 
      ngoId: string; 
      ngoData: Omit<NGOData, 'ngoId' | 'status' | 'createdAt' | 'updatedAt'> 
    }) => NGOService.createNGO(ngoId, ngoData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ngo', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['ngos'] });
    },
  });
};

// Hook to update NGO status (admin)
export const useUpdateNGOStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      ngoId, 
      status 
    }: { 
      ngoId: string; 
      status: 'approved' | 'rejected' 
    }) => NGOService.updateNGOStatus(ngoId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ngo', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['ngos'] });
    },
  });
};

// Hook to update NGO details
export const useUpdateNGO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      ngoId, 
      ngoData 
    }: { 
      ngoId: string; 
      ngoData: Partial<Omit<NGOData, 'ngoId' | 'createdAt'>> 
    }) => NGOService.updateNGO(ngoId, ngoData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ngo', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['ngos'] });
    },
  });
};
