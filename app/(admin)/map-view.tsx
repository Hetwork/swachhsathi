import AdminMapView from '@/component/AdminMapView';
import Container from '@/component/Container';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useWorkers } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MapViewScreen = () => {
  const params = useLocalSearchParams();
  const { data: reports, isLoading: reportsLoading } = useAllReports();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  
  const focusedLocation = params.lat && params.lon ? {
    latitude: parseFloat(params.lat as string),
    longitude: parseFloat(params.lon as string),
  } : undefined;
  
  const highlightedReportId = params.reportId as string | undefined;

  const handleReportPress = (reportId: string) => {
    router.push(`/(admin)/report-details?id=${reportId}`);
  };

  const handleWorkerPress = (workerId: string) => {
    router.push(`/(admin)/worker-profile?id=${workerId}`);
  };

  if (reportsLoading || workersLoading) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map View</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Ionicons name="trash" size={14} color={colors.primary} />
            <Text style={styles.statText}>{reports?.length || 0}</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="person" size={14} color="#10B981" />
            <Text style={styles.statText}>
              {workers?.filter(w => w.isActive && w.currentLocation).length || 0}
            </Text>
          </View>
        </View>
      </View>

      <AdminMapView
        reports={reports || []}
        workers={workers || []}
        onReportPress={handleReportPress}
        onWorkerPress={handleWorkerPress}
        focusedLocation={focusedLocation}
        highlightedReportId={highlightedReportId}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background || '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default MapViewScreen;
