import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Worker {
  id: string;
  name: string;
  uid: string;
  email: string;
  role: string;
}

interface AssignWorkerModalProps {
  visible: boolean;
  workers: Worker[] | undefined;
  onClose: () => void;
  onAssign: (workerId: string, workerName: string) => void;
  isLoading?: boolean;
}

const AssignWorkerModal: React.FC<AssignWorkerModalProps> = ({
  visible,
  workers,
  onClose,
  onAssign,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { bottom } = useSafeAreaInsets();

  const filteredWorkers = workers?.filter(w => 
    w.role === 'worker' && 
    (w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     w.email.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <Modal visible={visible} transparent animationType="slide" style={{ paddingBottom: bottom }}>
      <View style={[styles.modalOverlay, { paddingBottom: bottom }]}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Assign Worker</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.workerList}>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map(worker => (
                <TouchableOpacity
                  key={worker.uid}
                  style={styles.workerItem}
                  onPress={() => onAssign(worker.uid, worker.name)}
                  disabled={isLoading}
                >
                  <View style={styles.workerAvatar}>
                    <Text style={styles.workerAvatarText}>{worker.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.workerInfo}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerEmail}>{worker.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No workers found</Text>
              </View>
            )}
          </ScrollView>

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background || '#F3F4F6',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  workerList: {
    maxHeight: 400,
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workerAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  workerEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
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

export default AssignWorkerModal;
