import AssignWorkerModal from '@/component/AssignWorkerModal';
import ChangeStatusModal from '@/component/ChangeStatusModal';
import Container from '@/component/Container';
import LocationMap from '@/component/LocationMap';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAssignReportToWorker } from '@/firebase/hooks/useNGOReports';
import { useReport, useUpdateReportStatus } from '@/firebase/hooks/useReport';
import { useUser, useWorkersByNGO } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminReportDetails = () => {
  const params = useLocalSearchParams();
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const { data: report, isLoading: reportsLoading } = useReport(params.id as string);
  const { data: workers } = useWorkersByNGO(userData?.ngoId);
  const assignWorker = useAssignReportToWorker();
  const updateStatus = useUpdateReportStatus();
  
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
      if (!userData?.ngoId || !report?.id) {
        Alert.alert('Error', 'Missing required information');
        return;
      }

      await assignWorker.mutateAsync({
        reportId: report.id,
        ngoId: userData.ngoId,
        workerId: workerId,
        workerName: workerName,
      });
      setShowWorkerModal(false);
      Alert.alert('Success', `Report assigned to ${workerName}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to assign worker');
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B', icon: 'time-outline' };
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
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
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status).bg }]}>
              <Ionicons name={getStatusColor(report.status).icon as any} size={16} color={getStatusColor(report.status).text} />
              <Text style={[styles.statusText, { color: getStatusColor(report.status).text }]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
              </Text>
            </View>
            {report.severity && (
              <View style={styles.severityBadge}>
                <Ionicons
                  name={report.severity === 'High' ? 'alert-circle' : report.severity === 'Medium' ? 'warning' : 'information-circle'}
                  size={16}
                  color={getSeverityColor(report.severity)}
                />
                <Text style={[styles.severityText, { color: getSeverityColor(report.severity) }]}>
                  {report.severity} Severity
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{report.category || 'Report'}</Text>
          <Text style={styles.description}>{report.description}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Report Information</Text>

            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported By</Text>
                <Text style={styles.infoValue}>{report.userName}</Text>
                <Text style={styles.infoSubtext}>{report.userEmail}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported On</Text>
                <Text style={styles.infoValue}>{formatDate(report.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{report.location?.address || 'N/A'}</Text>
                <Text style={styles.infoSubtext}>
                  {report.location?.latitude?.toFixed(6)}, {report.location?.longitude?.toFixed(6)}
                </Text>
              </View>
            </View>

            {assignedWorker && (
              <View style={styles.infoRow}>
                <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Assigned Worker</Text>
                  <Text style={styles.infoValue}>{assignedWorker.name}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Before/After Images for Resolved Reports */}
          {report.status === 'resolved' && report.afterImageUrl && (
            <View style={styles.comparisonSection}>
              <Text style={styles.sectionTitle}>Before & After</Text>
              <View style={styles.imageComparisonContainer}>
                <View style={styles.imageComparisonItem}>
                  <Text style={styles.imageComparisonLabel}>Before</Text>
                  {report.imageUrl && (
                    <Image source={{ uri: report.imageUrl }} style={styles.comparisonImage} resizeMode="cover" />
                  )}
                </View>
                <View style={styles.imageComparisonItem}>
                  <Text style={styles.imageComparisonLabel}>After</Text>
                  <Image source={{ uri: report.afterImageUrl }} style={styles.comparisonImage} resizeMode="cover" />
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                <Text style={styles.verifiedText}>AI Verified - Cleaning Confirmed</Text>
              </View>
            </View>
          )}

          {/* Location Map */}
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>Report Location</Text>
            <LocationMap
              latitude={report.location?.latitude || 0}
              longitude={report.location?.longitude || 0}
              title={report.category || 'Report Location'}
              description={report.location?.address}
            />
          </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  category: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  mapSection: {
    marginBottom: 20,
  },
  comparisonSection: {
    marginBottom: 20,
  },
  imageComparisonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  imageComparisonItem: {
    flex: 1,
  },
  imageComparisonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  comparisonImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
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
