import AssignWorkerModal from '@/component/AssignWorkerModal';
import ChangeStatusModal from '@/component/ChangeStatusModal';
import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports, useUpdateReportStatus } from '@/firebase/hooks/useReport';
import { useWorkers } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminReportDetails = () => {
  const params = useLocalSearchParams();
  const { data: reports, isLoading: reportsLoading } = useAllReports();
  const { data: authUser } = useAuthUser();
  const { data: workers } = useWorkers();
  const updateStatus = useUpdateReportStatus();
  
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const report = reports?.find(r => r.id === params.id);

  if (reportsLoading) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Report not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  const handleAssignWorker = async (workerId: string, workerName: string) => {
    console.log('Assigning worker:', workerId, workerName);
    try {
      await updateStatus.mutateAsync({
        reportId: report.id,
        status: 'assigned',
        workerId: workerId,
      });
      setShowWorkerModal(false);
      Alert.alert('Success', `Report assigned to ${workerName}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to assign worker');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        reportId: report.id,
        status: newStatus,
        workerId: authUser?.uid,
      });
      setShowStatusModal(false);
      Alert.alert('Success', 'Status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'assigned': return '#3B82F6';
      case 'in-progress': return '#8B5CF6';
      case 'resolved': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  const assignedWorker = workers?.find(w => w.id === report.assignedTo);

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {report.imageUrl && (
          <Image source={{ uri: report.imageUrl }} style={styles.image} resizeMode="contain" />
        )}

        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                {report.status.toUpperCase()}
              </Text>
            </View>
            {report.severity && (
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) + '20' }]}>
                <Text style={[styles.severityText, { color: getSeverityColor(report.severity) }]}>
                  {report.severity.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{report.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {report.location?.latitude?.toFixed(6)}, {report.location?.longitude?.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported On</Text>
                <Text style={styles.infoValue}>
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            {report.category && (
              <View style={styles.infoRow}>
                <Ionicons name="pricetag" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>{report.category}</Text>
                </View>
              </View>
            )}

            {assignedWorker && (
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Assigned To</Text>
                  <Text style={styles.infoValue}>{assignedWorker.name}</Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={() => router.push(`/(admin)/map-view?lat=${report.location?.latitude}&lon=${report.location?.longitude}&reportId=${report.id}`)}
          >
            <Ionicons name="map" size={20} color={colors.white} />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>

          {report.status === 'pending' && (
            <TouchableOpacity style={styles.assignButton} onPress={() => setShowWorkerModal(true)}>
              <Ionicons name="person-add" size={20} color={colors.white} />
              <Text style={styles.assignButtonText}>Assign Worker</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.statusButton} onPress={() => setShowStatusModal(true)}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={styles.statusButtonText}>Change Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AssignWorkerModal
        visible={showWorkerModal}
        workers={workers}
        onClose={() => setShowWorkerModal(false)}
        onAssign={handleAssignWorker}
        isLoading={updateStatus.isPending}
      />

      <ChangeStatusModal
        visible={showStatusModal}
        currentStatus={report.status}
        onClose={() => setShowStatusModal(false)}
        onStatusChange={handleStatusChange}
        isLoading={updateStatus.isPending}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
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
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.border,
  },
  content: {
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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

});

export default AdminReportDetails;
