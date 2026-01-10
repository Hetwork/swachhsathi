import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SupportService, { SupportTicket } from '../services/SupportService';

// Query Keys
export const supportKeys = {
  all: ['support'] as const,
  userTickets: (userId?: string) => [...supportKeys.all, 'user', userId] as const,
  ticket: (ticketId: string) => [...supportKeys.all, 'ticket', ticketId] as const,
  allTickets: () => [...supportKeys.all, 'allTickets'] as const,
};

// Get user's support tickets
export const useUserTickets = (userId?: string) => {
  return useQuery({
    queryKey: supportKeys.userTickets(userId),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return SupportService.getUserTickets(userId);
    },
    enabled: !!userId,
  });
};

// Get a single ticket by ID
export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: supportKeys.ticket(ticketId),
    queryFn: () => SupportService.getTicketById(ticketId),
    enabled: !!ticketId,
  });
};

// Get all tickets (admin only)
export const useAllTickets = () => {
  return useQuery({
    queryKey: supportKeys.allTickets(),
    queryFn: () => SupportService.getAllTickets(),
  });
};

// Create a new support ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      userName: string;
      userEmail: string;
      subject: string;
      message: string;
      category: SupportTicket['category'];
    }) => SupportService.createTicket(data),
    onSuccess: (_, variables) => {
      // Invalidate user tickets to refetch
      queryClient.invalidateQueries({
        queryKey: supportKeys.userTickets(variables.userId),
      });
      // Invalidate all tickets for admin
      queryClient.invalidateQueries({
        queryKey: supportKeys.allTickets(),
      });
    },
  });
};

// Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: SupportTicket['status'];
    }) => SupportService.updateTicketStatus(ticketId, status),
    onSuccess: (_, variables) => {
      // Invalidate the specific ticket
      queryClient.invalidateQueries({
        queryKey: supportKeys.ticket(variables.ticketId),
      });
      // Invalidate all tickets lists
      queryClient.invalidateQueries({
        queryKey: supportKeys.all,
      });
    },
  });
};

// Add admin response
export const useAddAdminResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      response,
    }: {
      ticketId: string;
      response: string;
    }) => SupportService.addAdminResponse(ticketId, response),
    onSuccess: (_, variables) => {
      // Invalidate the specific ticket
      queryClient.invalidateQueries({
        queryKey: supportKeys.ticket(variables.ticketId),
      });
      // Invalidate all tickets lists
      queryClient.invalidateQueries({
        queryKey: supportKeys.all,
      });
    },
  });
};
