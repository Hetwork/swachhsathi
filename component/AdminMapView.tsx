import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface Report {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: string;
  category?: string;
  description: string;
}

interface Worker {
  uid: string;
  name: string;
  isActive: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface AdminMapViewProps {
  reports: Report[];
  workers: Worker[];
  onReportPress?: (reportId: string) => void;
  onWorkerPress?: (workerId: string) => void;
  focusedLocation?: { latitude: number; longitude: number };
  highlightedReportId?: string;
}

const AdminMapView: React.FC<AdminMapViewProps> = ({
  reports,
  workers,
  onReportPress,
  onWorkerPress,
  focusedLocation,
  highlightedReportId,
}) => {
  const mapRef = useRef<MapView>(null);
  const [showReports, setShowReports] = useState(true);
  const [showWorkers, setShowWorkers] = useState(true);
  
  // Center on focused location
  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: focusedLocation.latitude,
          longitude: focusedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }, 500);
    }
  }, [focusedLocation]);

  // Center on all reports when they load
  useEffect(() => {
    if (!focusedLocation && reports.length > 0 && mapRef.current) {
      setTimeout(() => {
        const region = getInitialRegion();
        mapRef.current?.animateToRegion(region, 1000);
      }, 500);
    }
  }, [reports]);

  // Calculate initial region based on all markers
  const getInitialRegion = () => {
    if (focusedLocation) {
      return {
        latitude: focusedLocation.latitude,
        longitude: focusedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    
    // Prioritize reports for centering
    const reportLocations = reports.map(r => r.location);
    const workerLocations = workers.filter(w => w.currentLocation).map(w => w.currentLocation!);
    
    // Use only reports if available, otherwise include workers
    const allLocations = reportLocations.length > 0 ? reportLocations : [...reportLocations, ...workerLocations];

    if (allLocations.length === 0) {
      // Default to Delhi, India
      return {
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    if (allLocations.length === 1) {
      // Single location - close zoom
      return {
        latitude: allLocations[0].latitude,
        longitude: allLocations[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const latitudes = allLocations.map(l => l.latitude);
    const longitudes = allLocations.map(l => l.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5;
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.02), // Minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.02),
    };
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'assigned': return '#3B82F6';
      case 'in-progress': return '#8B5CF6';
      case 'resolved': return '#10B981';
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getInitialRegion()}
      >
        {showReports && reports.map((report) => {
          const isHighlighted = report.id === highlightedReportId;
          return (
          <Marker
            key={`report-${report.id}`}
            coordinate={report.location}
            pinColor={getMarkerColor(report.status)}
            onPress={() => onReportPress?.(report.id)}
          >
            <View style={[
              styles.reportMarker, 
              { backgroundColor: getMarkerColor(report.status) },
              isHighlighted && styles.highlightedMarker
            ]}>
              <Ionicons name="trash" size={isHighlighted ? 24 : 20} color={colors.white} />
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{report.category || 'Report'}</Text>
                <Text style={styles.calloutDescription} numberOfLines={2}>
                  {report.description}
                </Text>
                <Text style={styles.calloutStatus}>Status: {report.status}</Text>
              </View>
            </Callout>
          </Marker>
          );
        })}

        {showWorkers && workers
          .filter(w => w.isActive && w.currentLocation)
          .map((worker) => (
            <Marker
              key={`worker-${worker.uid}`}
              coordinate={worker.currentLocation!}
              onPress={() => onWorkerPress?.(worker.uid)}
            >
              <View style={styles.workerMarker}>
                <Ionicons name="person" size={20} color={colors.white} />
              </View>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{worker.name}</Text>
                  <Text style={styles.calloutStatus}>Active Worker</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, !showReports && styles.controlButtonInactive]}
          onPress={() => setShowReports(!showReports)}
        >
          <Ionicons name="trash" size={20} color={showReports ? colors.white : colors.textSecondary} />
          <Text style={[styles.controlText, !showReports && styles.controlTextInactive]}>
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !showWorkers && styles.controlButtonInactive]}
          onPress={() => setShowWorkers(!showWorkers)}
        >
          <Ionicons name="person" size={20} color={showWorkers ? colors.white : colors.textSecondary} />
          <Text style={[styles.controlText, !showWorkers && styles.controlTextInactive]}>
            Workers
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Assigned</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Resolved</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  reportMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  highlightedMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  workerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
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
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  calloutStatus: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonInactive: {
    backgroundColor: colors.white,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  controlTextInactive: {
    color: colors.textSecondary,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default AdminMapView;
