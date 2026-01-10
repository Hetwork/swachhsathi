import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReportService, { Report } from '../services/ReportService';

// Hook to get all reports
export const useAllReports = () => {
  return useQuery({
    queryKey: ['reports', 'all'],
    queryFn: () => ReportService.getAllReports(),
  });
};

// Hook to get user reports
export const useUserReports = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ['reports', userId],
    queryFn: () => (userId ? ReportService.getUserReports(userId) : []),
    enabled: !!userId,
  });
};

// Hook to get single report
export const useReport = (reportId: string | null | undefined) => {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => (reportId ? ReportService.getReport(reportId) : null),
    enabled: !!reportId,
  });
};

// Hook to create report
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) =>
      ReportService.createReport(reportData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports', variables.userId] });
    },
  });
};

// Hook to update report status
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, status , workerId }: { reportId: string; status: Report['status']; workerId?: string }) =>
      ReportService.updateReportStatus(reportId, status, workerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook to delete report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => ReportService.deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
