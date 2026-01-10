import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import UserService from '../services/UserService';
import { useAllReports } from './useReport';

interface UserData {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'worker' | 'admin';
  createdAt?: any;
  ngoId?: string;
  fcmToken?: string | null;
  platform?: 'ios' | 'android' | 'web';
  updatedAt?: any;
}

// Hook to get all workers
export const useWorkers = () => {
  const { data: reports } = useAllReports();
  
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const workers = await UserService.getWorkers();
      
      // Calculate stats for each worker
      return workers.map((worker: any) => {
        const workerReports = reports?.filter(r => r.assignedTo === worker.uid) || [];
        const completedReports = workerReports.filter(r => r.status === 'resolved').length;
        const assignedReports = workerReports.filter(r => r.status === 'assigned' || r.status === 'in-progress').length;
        
        return {
          ...worker,
          assignedReports,
          completedReports,
          status: assignedReports > 0 ? 'active' : 'inactive',
        };
      });
    },
  });
};

// Hook to get workers by NGO (real-time)
export const useWorkersByNGO = (ngoId: string | null | undefined) => {
  const { data: reports } = useAllReports();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['workers', ngoId],
    queryFn: async () => {
      if (!ngoId) return [];
      const workers = await UserService.getWorkersByNGO(ngoId);
      
      // Calculate stats for each worker
      return workers.map((worker: any) => {
        const workerReports = reports?.filter(r => r.assignedTo === worker.uid) || [];
        const completedReports = workerReports.filter(r => r.status === 'resolved').length;
        const assignedReports = workerReports.filter(r => r.status === 'assigned' || r.status === 'in-progress').length;
        
        return {
          ...worker,
          assignedReports,
          completedReports,
          status: assignedReports > 0 ? 'active' : 'inactive',
        };
      });
    },
    enabled: !!ngoId,
  });

  // Set up real-time listener
  useEffect(() => {
    if (!ngoId) return;

    const unsubscribe = UserService.subscribeToWorkersByNGO(
      ngoId,
      (workers) => {
        // Calculate stats for each worker
        const workersWithStats = workers.map((worker: any) => {
          const workerReports = reports?.filter(r => r.assignedTo === worker.uid) || [];
          const completedReports = workerReports.filter(r => r.status === 'resolved').length;
          const assignedReports = workerReports.filter(r => r.status === 'assigned' || r.status === 'in-progress').length;
          
          return {
            ...worker,
            assignedReports,
            completedReports,
            status: assignedReports > 0 ? 'active' : 'inactive',
          };
        });

        // Update the query cache with real-time data
        queryClient.setQueryData(['workers', ngoId], workersWithStats);
      },
      (error) => {
        console.error('Error subscribing to workers:', error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [ngoId, reports, queryClient]);

  return query;
};

// Hook to get user data
export const useUser = (uid: string | null | undefined) => {
  return useQuery({
    queryKey: ['user', uid],
    queryFn: () => (uid ? UserService.getUser(uid) : null),
    enabled: !!uid,
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, userData }: { uid: string; userData: Partial<UserData> }) =>
      UserService.createUser(uid, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.uid] });
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, userData }: { uid: string; userData: Partial<UserData> }) =>
      UserService.updateUser(uid, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.uid] });
    },
  });
};
