import { useNotifications } from '@/firebase/hooks/useNotifications';
import React, { useEffect } from 'react';

// Component to initialize notifications
const NotificationInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notificationPermission } = useNotifications();

  useEffect(() => {
    if (notificationPermission !== null) {
      console.log('Notification permission status:', notificationPermission);
    }
  }, [notificationPermission]);

  return <>{children}</>;
};

export default NotificationInitializer;
