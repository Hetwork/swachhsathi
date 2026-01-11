import Container from '@/component/Container';
import LocationMap from '@/component/LocationMap';
import { useReport } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ReportDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: report, isLoading } = useReport(id as string);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B', icon: 'time-outline' };
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Report Submitted', icon: 'checkmark-circle', description: 'Your report has been received' },
      { key: 'assigned', label: 'Worker Assigned', icon: 'person', description: 'A worker has been assigned to handle this report' },
      { key: 'in-progress', label: 'In Progress', icon: 'construct', description: 'Worker is working on resolving the issue' },
      { key: 'resolved', label: 'Resolved', icon: 'checkmark-done', description: 'Issue has been successfully resolved' },
    ];

    const statusOrder = ['pending', 'assigned', 'in-progress', 'resolved'];
    const currentIndex = statusOrder.indexOf(report?.status || 'pending');

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Report not found</Text>
        </View>
      </Container>
    );
  }

  const statusColors = getStatusColor(report.status);

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {report.imageUrl && (
          <Image source={{ uri: report.imageUrl }} style={styles.reportImage} resizeMode='contain' />
        )}

        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Ionicons name={statusColors.icon as any} size={16} color={statusColors.text} />
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
              </Text>
            </View>
            {report.severity && (
              <View style={styles.severityBadge}>
                <Ionicons 
                  name={report.severity === 'High' ? 'alert-circle' : report.severity === 'Medium' ? 'warning' : 'information-circle'} 
                  size={16} 
                  color={report.severity === 'High' ? '#EF4444' : report.severity === 'Medium' ? '#F59E0B' : '#10B981'} 
                />
                <Text style={styles.severityText}>{report.severity} Severity</Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{report.category}</Text>
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
                <Text style={styles.infoValue}>{report.location.address}</Text>
                <Text style={styles.infoSubtext}>
                  {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {report.workerName && (
              <View style={styles.infoRow}>
                <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Assigned Worker</Text>
                  <Text style={styles.infoValue}>{report.workerName}</Text>
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
              latitude={report.location.latitude}
              longitude={report.location.longitude}
              title={report.category || 'Report Location'}
              description={report.location.address}
            />
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => setShowStatusModal(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                Track Status
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Status Tracking Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Status Tracking</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
              {getStatusSteps().map((step, index) => (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.timelineIndicator}>
                    <View style={[
                      styles.timelineDot,
                      step.completed && styles.timelineDotCompleted,
                      step.active && styles.timelineDotActive
                    ]}>
                      <Ionicons 
                        name={step.icon as any} 
                        size={step.active ? 24 : 20} 
                        color={step.completed ? colors.white : colors.textSecondary} 
                      />
                    </View>
                    {index < getStatusSteps().length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        step.completed && styles.timelineLineCompleted
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineLabel,
                      step.completed && styles.timelineLabelCompleted,
                      step.active && styles.timelineLabelActive
                    ]}>
                      {step.label}
                    </Text>
                    <Text style={styles.timelineDescription}>
                      {step.description}
                    </Text>
                    {step.active && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Current Status</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.lastUpdated}>
                Last updated: {formatDate(report.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  reportImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    color: colors.textSecondary,
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
    marginBottom: 24,
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
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineContainer: {
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timelineLabelCompleted: {
    color: colors.textPrimary,
  },
  timelineLabelActive: {
    color: colors.primary,
    fontSize: 18,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lastUpdated: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ReportDetails;
