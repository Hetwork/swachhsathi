import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import NotificationService from '../services/NotificationService';

// Hook to get current auth user
export const useAuthUser = () => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  return useQuery({
    queryKey: ['authUser'],
    queryFn: () => user,
    initialData: user,
  });
};

// Hook for sign in
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

// Hook for sign up
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.signUp(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

// Hook for sign out
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useAuthUser();

  return useMutation({
    mutationFn: async () => {
      // Remove FCM token before signing out
      if (authUser?.uid) {
        await NotificationService.removeFCMToken(authUser.uid);
      }
      return AuthService.signOut();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};
