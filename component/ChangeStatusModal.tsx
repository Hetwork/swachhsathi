import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChangeStatusModalProps {
  visible: boolean;
  currentStatus: string;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  isLoading?: boolean;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  visible,
  currentStatus,
  onClose,
  onStatusChange,
  isLoading = false,
}) => {

  const { bottom } = useSafeAreaInsets();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'assigned': return '#3B82F6';
      case 'in-progress': return '#8B5CF6';
      case 'resolved': return '#10B981';
      default: return colors.textSecondary;
    }
  };

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[  styles.modalOverlay, { paddingBottom: bottom }]}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusList}>
            {statuses.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[styles.statusItem, currentStatus === value && styles.statusItemActive]}
                onPress={() => onStatusChange(value)}
                disabled={isLoading || currentStatus === value}
              >
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(value) }]} />
                <Text style={[styles.statusItemText, currentStatus === value && styles.statusItemTextActive]}>
                  {label}
                </Text>
                {currentStatus === value && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusList: {
    padding: 20,
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background || '#F3F4F6',
    gap: 12,
  },
  statusItemActive: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  statusItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChangeStatusModal;
