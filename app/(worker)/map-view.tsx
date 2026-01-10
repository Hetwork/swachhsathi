import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { getCurrentLocation } from '@/utils/locationTracker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const WorkerMapView = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const { data: reports, isLoading } = useAllReports();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialRegion, setInitialRegion] = useState<any>(null);

  // Get reports assigned to current worker that are not resolved (pending, assigned, or in-progress)
  const pendingReports = reports?.filter(
    r => r.assignedTo === authUser?.uid && r.status !== 'resolved'
  ) || [];

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setInitialRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else {
          Alert.alert('Location Error', 'Unable to get your current location');
          // Use a default location if can't get current location
          if (userData?.currentLocation) {
            setUserLocation({
              latitude: userData.currentLocation.latitude,
              longitude: userData.currentLocation.longitude,
            });
            setInitialRegion({
              latitude: userData.currentLocation.latitude,
              longitude: userData.currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Failed to get your location');
      }
    };

    fetchLocation();
  }, [userData]);

  if (isLoading || !initialRegion) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map View</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </Container>
    );
  }

  const handleMarkerPress = (report: any) => {
    Alert.alert(
      report.category || 'Report',
      report.description || 'No description',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => router.push(`/(worker)/task-details?id=${report.id}`) }
      ]
    );
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map View</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* User's current location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description="You are here"
              pinColor="#3B82F6"
            >
              <View style={styles.userMarker}>
                <Ionicons name="person" size={20} color={colors.white} />
              </View>
            </Marker>
          )}

          {/* Pending reports markers in red */}
          {pendingReports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={report.category || 'Report'}
              description={report.description || 'No description'}
              onPress={() => handleMarkerPress(report)}
            >
              <View style={styles.reportMarker}>
                <Ionicons name="warning" size={20} color={colors.white} />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.legendItem}>
            <View style={styles.userMarker}>
              <Ionicons name="person" size={16} color={colors.white} />
            </View>
            <Text style={styles.legendText}>Your Location</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.reportMarker}>
              <Ionicons name="warning" size={16} color={colors.white} />
            </View>
            <Text style={styles.legendText}>Pending Reports ({pendingReports.length})</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  reportMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default WorkerMapView;
