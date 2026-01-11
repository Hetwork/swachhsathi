import Container from '@/component/Container';
import LocationMap from '@/component/LocationMap';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports, useUpdateReportStatus } from '@/firebase/hooks/useReport';
import { useUser } from '@/firebase/hooks/useUser';
import AIService from '@/firebase/services/AIService';
import ReportService from '@/firebase/services/ReportService';
import StorageService from '@/firebase/services/StorageService';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskDetails = () => {
  const params = useLocalSearchParams();
  const { data: reports, isLoading } = useAllReports();
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const updateStatus = useUpdateReportStatus();
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const task = reports?.find(r => r.id === params.id && r.assignedTo === authUser?.uid);

  if (isLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Task not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      // Update status using the hook (for UI reactivity)
      await updateStatus.mutateAsync({
        reportId: task.id!,
        status: newStatus as any,
      });

      // Create status history entry in subcollection
      await ReportService.createStatusHistory(
        task.id!,
        newStatus as any,
        authUser?.uid || '',
        userData?.name || 'Worker',
        `Status changed to ${newStatus}`
      );

      Alert.alert('Success', 'Task status updated');
    } catch (error) {
      console.error('Status update error:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const captureAfterPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAfterImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleCompleteTask = async () => {
    if (!afterImage) {
      Alert.alert('Photo Required', 'Please capture an after-cleaning photo');
      return;
    }

    try {
      setUploading(true);
      console.log('Uploading after image...');
      
      // Upload after image
      const afterImageUrl = await StorageService.uploadReportImage(afterImage, authUser!.uid);
      console.log('After image uploaded:', afterImageUrl);
      
      setUploading(false);
      setAnalyzing(true);

      console.log('Comparing images...');
      console.log('Before:', task.imageUrl);
      console.log('After:', afterImageUrl);

      // AI comparison of before and after images
      const comparisonResult = await AIService.compareBeforeAfter(task.imageUrl, afterImageUrl);
      console.log('Comparison result:', comparisonResult);
      
      setAnalyzing(false);

      if (comparisonResult.isClean) {
        // Complete task with after image, status update, and history in one atomic operation
        await ReportService.completeTaskWithAfterImage(
          task.id!,
          afterImageUrl,
          authUser?.uid || '',
          userData?.name || 'Worker',
          `Task completed with ${comparisonResult.cleanlinessScore}% cleanliness score. AI Verified.`
        );
        
        Alert.alert(
          'Task Completed! 🎉',
          `AI Verification: ${comparisonResult.message}\n\nCleanliness Score: ${comparisonResult.cleanlinessScore}%`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          `${comparisonResult.message}\n\nPlease ensure the area is properly cleaned and try again.`,
          [
            { text: 'Retake Photo', onPress: () => setAfterImage(null) },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error: any) {
      setUploading(false);
      setAnalyzing(false);
      console.error('Complete task error:', error);
      console.error('Error details:', error.message, error.code);
      Alert.alert(
        'Error',
        `Failed to complete task: ${error.message || 'Unknown error'}\n\nPlease try again.`
      );
    }
  };
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Report Submitted', icon: 'document-text', description: 'Report received from citizen' },
      { key: 'assigned', label: 'Assigned to You', icon: 'person', description: 'Task has been assigned to you' },
      { key: 'in-progress', label: 'In Progress', icon: 'construct', description: 'You are working on this task' },
      { key: 'resolved', label: 'Completed', icon: 'checkmark-done', description: 'Task has been completed' },
    ];

    const statusOrder = ['pending', 'assigned', 'in-progress', 'resolved'];
    const currentIndex = statusOrder.indexOf(task?.status || 'assigned');

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#3B82F6';
      case 'in-progress': return '#8B5CF6';
      case 'resolved': return '#10B981';
      default: return colors.textSecondary;
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

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {task.imageUrl && (
          <Image source={{ uri: task.imageUrl }} style={styles.image} resizeMode="contain" />
        )}

        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                {task.status.toUpperCase().replace('-', ' ')}
              </Text>
            </View>
            {task.severity && (
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(task.severity) + '20' }]}>
                <Text style={[styles.severityText, { color: getSeverityColor(task.severity) }]}>
                  {task.severity.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{task.category || 'Garbage Report'}</Text>
          <Text style={styles.description}>{task.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported By</Text>
                <Text style={styles.infoValue}>{task.userName}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported On</Text>
                <Text style={styles.infoValue}>{formatDate(task.createdAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.locationTitle}>Task Location</Text>
            </View>
            <LocationMap
              latitude={task.location.latitude}
              longitude={task.location.longitude}
              title={task.category || 'Task Location'}
              description={task.location.address}
            />
            <Text style={styles.locationAddress}>{task.location.address}</Text>
          </View>

          {/* Status Tracking Button */}
          <TouchableOpacity
            style={styles.statusTrackButton}
            onPress={() => setShowStatusModal(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.statusTrackButtonText}>Track Task Status</Text>
          </TouchableOpacity>

          {task.status === 'assigned' && (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => handleStatusUpdate('in-progress')}
              disabled={updateStatus.isPending}
            >
              <Ionicons name="play-circle" size={20} color={colors.white} />
              <Text style={styles.startButtonText}>Start Task</Text>
            </TouchableOpacity>
          )}

          {task.status === 'in-progress' && (
            <>
              {!afterImage ? (
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={captureAfterPhoto}
                >
                  <Ionicons name="camera" size={20} color={colors.white} />
                  <Text style={styles.cameraButtonText}>Capture After Photo</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.afterPhotoContainer}>
                  <Text style={styles.afterPhotoLabel}>After Cleaning Photo:</Text>
                  <Image source={{ uri: afterImage }} style={styles.afterPhoto} />
                  <View style={styles.photoActions}>
                    <TouchableOpacity 
                      style={styles.retakeButton}
                      onPress={captureAfterPhoto}
                    >
                      <Ionicons name="camera" size={16} color={colors.primary} />
                      <Text style={styles.retakeButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={handleCompleteTask}
                      disabled={uploading || analyzing}
                    >
                      {uploading || analyzing ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                      )}
                      <Text style={styles.completeButtonText}>
                        {uploading ? 'Uploading...' : analyzing ? 'Verifying...' : 'Complete Task'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}

          {task.status === 'resolved' && (
            <>
              <View style={styles.completedBanner}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.completedText}>Task Completed</Text>
              </View>

              {task.afterImageUrl && (
                <View style={styles.afterImageSection}>
                  <Text style={styles.sectionLabel}>After Cleaning Photo</Text>
                  <Image source={{ uri: task.afterImageUrl }} style={styles.completedAfterPhoto} resizeMode="contain" />
                  <View style={styles.imageCompareNote}>
                    <Ionicons name="information-circle" size={16} color={colors.primary} />
                    <Text style={styles.imageCompareText}>This photo was verified by AI to confirm the cleaning was completed successfully.</Text>
                  </View>
                </View>
              )}
            </>
          )}
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
              <Text style={styles.modalTitle}>Task Status Timeline</Text>
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
                Last updated: {formatDate(task.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
  category: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
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
  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
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
  locationAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  afterPhotoContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  afterPhotoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  afterPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  completeButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  afterImageSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  completedAfterPhoto: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  imageCompareNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
  },
  imageCompareText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statusTrackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  statusTrackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
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

export default TaskDetails;
