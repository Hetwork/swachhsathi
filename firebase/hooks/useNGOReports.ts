import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NGOReportService from '../services/NGOReportService';
import { Report } from '../services/ReportService';

// Get all reports for NGO
export const useNGOReports = (ngoId: string | undefined) => {
  return useQuery({
    queryKey: ['ngo-reports', ngoId],
    queryFn: () => NGOReportService.getNGOReports(ngoId!),
    enabled: !!ngoId,
  });
};

// Get pending reports for NGO
export const usePendingNGOReports = (ngoId: string | undefined) => {
  return useQuery({
    queryKey: ['ngo-pending-reports', ngoId],
    queryFn: () => NGOReportService.getPendingNGOReports(ngoId!),
    enabled: !!ngoId,
  });
};

// Get pending reports by categories
export const usePendingReportsByCategories = (
  ngoId: string | undefined,
  categories: string[]
) => {
  return useQuery({
    queryKey: ['ngo-reports-by-categories', ngoId, categories],
    queryFn: () => NGOReportService.getPendingReportsByCategories(ngoId!, categories),
    enabled: !!ngoId && categories.length > 0,
  });
};

// Get NGO reports by status
export const useNGOReportsByStatus = (
  ngoId: string | undefined,
  status: Report['status']
) => {
  return useQuery({
    queryKey: ['ngo-reports-status', ngoId, status],
    queryFn: () => NGOReportService.getNGOReportsByStatus(ngoId!, status),
    enabled: !!ngoId,
  });
};

// Get worker reports in NGO
export const useWorkerReportsInNGO = (
  ngoId: string | undefined,
  workerId: string | undefined
) => {
  return useQuery({
    queryKey: ['worker-ngo-reports', ngoId, workerId],
    queryFn: () => NGOReportService.getWorkerReportsInNGO(ngoId!, workerId!),
    enabled: !!ngoId && !!workerId,
  });
};

// Get NGO report statistics
export const useNGOReportStats = (ngoId: string | undefined) => {
  return useQuery({
    queryKey: ['ngo-report-stats', ngoId],
    queryFn: () => NGOReportService.getNGOReportStats(ngoId!),
    enabled: !!ngoId,
  });
};

// Assign report to worker
export const useAssignReportToWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      ngoId,
      workerId,
      workerName,
    }: {
      reportId: string;
      ngoId: string;
      workerId: string;
      workerName: string;
    }) => NGOReportService.assignReportToWorker(reportId, ngoId, workerId, workerName),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['ngo-reports', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['ngo-pending-reports', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['ngo-report-stats', variables.ngoId] });
      queryClient.invalidateQueries({ queryKey: ['worker-ngo-reports', variables.ngoId, variables.workerId] });
    },
  });
};
