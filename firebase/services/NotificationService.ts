import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import UserService from './UserService';

class NotificationService {
  // Request notification permissions
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted:', authStatus);
      }

      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get FCM token
  async getFCMToken(): Promise<string | null> {
    try {
      // Request permission first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Save FCM token to user document
  async saveFCMToken(uid: string): Promise<void> {
    try {
      const token = await this.getFCMToken();
      if (token) {
        await UserService.updateUser(uid, {
          fcmToken: token,
          platform: Platform.OS,
        });
        console.log('FCM token saved successfully');
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  // Remove FCM token on logout
  async removeFCMToken(uid: string): Promise<void> {
    try {
      await UserService.updateUser(uid, {
        fcmToken: null,
      });
      console.log('FCM token removed successfully');
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  }

  // Listen for token refresh
  onTokenRefresh(uid: string, callback?: (token: string) => void) {
    return messaging().onTokenRefresh(async (token) => {
      console.log('FCM token refreshed:', token);
      try {
        await UserService.updateUser(uid, {
          fcmToken: token,
          platform: Platform.OS,
        });
        if (callback) callback(token);
      } catch (error) {
        console.error('Error updating refreshed FCM token:', error);
      }
    });
  }

  // Handle foreground notifications
  onForegroundMessage(callback: (message: any) => void) {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      callback(remoteMessage);
    });
  }

  // Handle background notification open
  onNotificationOpenedApp(callback: (message: any) => void) {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app from background:', remoteMessage);
      callback(remoteMessage);
    });
  }

  // Get initial notification (app opened from quit state)
  async getInitialNotification() {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log('Notification opened app from quit state:', remoteMessage);
      return remoteMessage;
    }
    return null;
  }

  // Set background message handler (must be called at top level)
  setBackgroundMessageHandler(handler: (message: any) => Promise<void>) {
    messaging().setBackgroundMessageHandler(handler);
  }
}

export default new NotificationService();
