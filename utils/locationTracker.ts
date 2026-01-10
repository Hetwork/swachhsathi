import * as Location from 'expo-location';
import UserService from '@/firebase/services/UserService';

let locationSubscription: Location.LocationSubscription | null = null;

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const startLocationTracking = async (userId: string) => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    // Stop existing subscription if any
    if (locationSubscription) {
      locationSubscription.remove();
    }

    // Start watching location
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update if moved 10 meters
      },
      async (location) => {
        const { latitude, longitude } = location.coords;
        console.log('Location updated:', latitude, longitude);
        try {
          await UserService.updateUser(userId, {
            currentLocation: {
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            },
          });
          console.log('Location saved to Firestore');
        } catch (error) {
          console.error('Error updating location:', error);
        }
      }
    );

    console.log('Location tracking started for user:', userId);

    return true;
  } catch (error) {
    console.error('Error starting location tracking:', error);
    return false;
  }
};

export const stopLocationTracking = () => {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
};

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};
