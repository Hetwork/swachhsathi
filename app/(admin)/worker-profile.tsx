import Container from '@/component/Container';
import LocationMap from '@/component/LocationMap';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WorkerProfile = () => {
  const params = useLocalSearchParams();
  const workerId = params.id as string;
  const { data: worker, isLoading } = useUser(workerId);
  const { data: reports } = useAllReports();

  const workerReports = reports?.filter(r => r.assignedTo === workerId) || [];
  const stats = {
    assigned: workerReports.filter(r => r.status === 'assigned' || r.status === 'in-progress').length,
    completed: workerReports.filter(r => r.status === 'resolved').length,
    total: workerReports.length,
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  if (!worker) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Worker not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Worker Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: worker.isActive ? colors.primary : '#9CA3AF' }]}>
              <Text style={styles.avatarText}>{worker.name?.charAt(0).toUpperCase() || 'W'}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: worker.isActive ? '#10B981' : '#EF4444' }]} />
          </View>
          <Text style={styles.name}>{worker.name || 'Worker'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: worker.isActive ? '#10B98120' : '#EF444420' }]}>
            <View style={[styles.statusIndicator, { backgroundColor: worker.isActive ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.statusText, { color: worker.isActive ? '#10B981' : '#EF4444' }]}>
              {worker.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{worker.email || 'N/A'}</Text>
            </View>
          </View>
          {worker.phone && (
            <View style={styles.contactItem}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{worker.phone}</Text>
              </View>
            </View>
          )}
        </View>

        {worker.isActive && worker.currentLocation && (
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.locationTitle}>Current Location</Text>
            </View>
            <LocationMap
              latitude={worker.currentLocation.latitude}
              longitude={worker.currentLocation.longitude}
              title={worker.name || 'Worker'}
              description="Current location"
            />
            <Text style={styles.locationCoords}>
              {worker.currentLocation.latitude?.toFixed(6)}, {worker.currentLocation.longitude?.toFixed(6)}
            </Text>
            {worker.currentLocation.timestamp && (
              <Text style={styles.locationTime}>
                Last updated: {new Date(worker.currentLocation.timestamp).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="briefcase" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{stats.assigned}</Text>
              <Text style={styles.statLabel}>Active Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.assignButton}
          onPress={() => Alert.alert('Coming Soon', 'Assign task functionality will be implemented')}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.assignButtonText}>Assign Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationCoords: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    marginTop: 12,
    marginBottom: 8,
  },
  locationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default WorkerProfile;
