import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NotificationService from '../services/NotificationService';
import { useAuthUser } from './useAuth';

// Hook to initialize and manage FCM token
export const useNotifications = () => {
  const { data: authUser } = useAuthUser();
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authUser?.uid) return;

    let unsubscribeTokenRefresh: (() => void) | undefined;
    let unsubscribeForeground: (() => void) | undefined;

    const initializeNotifications = async () => {
      try {
        // Request permission and save FCM token
        await NotificationService.saveFCMToken(authUser.uid);
        setNotificationPermission(true);

        // Listen for token refresh
        unsubscribeTokenRefresh = NotificationService.onTokenRefresh(authUser.uid);

        // Handle foreground notifications
        unsubscribeForeground = NotificationService.onForegroundMessage((message) => {
          // Show alert or custom notification UI
          if (message.notification) {
            Alert.alert(
              message.notification.title || 'Notification',
              message.notification.body || ''
            );
          }
        });

        // Handle notification that opened the app from background
        NotificationService.onNotificationOpenedApp((message) => {
          console.log('App opened from notification:', message);
          // Handle navigation based on notification data
        });

        // Check if app was opened from a notification (quit state)
        const initialNotification = await NotificationService.getInitialNotification();
        if (initialNotification) {
          console.log('App opened from quit state notification:', initialNotification);
          // Handle navigation based on notification data
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setNotificationPermission(false);
      }
    };

    initializeNotifications();

    // Cleanup on unmount or logout
    return () => {
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, [authUser?.uid]);

  const requestPermission = async () => {
    if (!authUser?.uid) return false;
    
    const granted = await NotificationService.requestPermission();
    setNotificationPermission(granted);
    
    if (granted) {
      await NotificationService.saveFCMToken(authUser.uid);
    }
    
    return granted;
  };

  return {
    notificationPermission,
    requestPermission,
  };
};

// Hook to manually save FCM token
export const useSaveFCMToken = () => {
  const { data: authUser } = useAuthUser();

  const saveFCMToken = async () => {
    if (!authUser?.uid) {
      console.warn('Cannot save FCM token: No authenticated user');
      return;
    }

    await NotificationService.saveFCMToken(authUser.uid);
  };

  return { saveFCMToken };
};

// Hook to remove FCM token on logout
export const useRemoveFCMToken = () => {
  const removeFCMToken = async (uid: string) => {
    await NotificationService.removeFCMToken(uid);
  };

  return { removeFCMToken };
};
