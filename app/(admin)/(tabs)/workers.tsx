import Container from '@/component/Container';
import { useWorkers } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminWorkers = () => {
  const { data: workers, isLoading } = useWorkers();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredWorkers = workers?.filter(worker => {
    if (filter === 'all') return true;
    if (filter === 'active') return worker.isActive === true;
    if (filter === 'inactive') return worker.isActive !== true;
    return true;
  }) || [];

  const FilterChip = ({ label, value }: any) => (
    <TouchableOpacity
      style={[styles.filterChip, filter === value && styles.filterChipActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterChipText, filter === value && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const WorkerCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.workerCard}
      onPress={() => router.push(`/(admin)/worker-profile?id=${item.uid}`)}
    >
      <View style={styles.workerHeader}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: item.isActive ? colors.primary : '#9CA3AF' }]}>
            <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase() || 'W'}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#10B981' : '#EF4444' }]} />
        </View>
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name || 'Worker'}</Text>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.contactText}>{item.email || 'N/A'}</Text>
          </View>
          {item.phone && (
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.phone}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.assignedReports}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.completedReports}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {item.completedReports > 0 ? Math.round((item.completedReports / (item.completedReports + item.assignedReports)) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push(`/(admin)/worker-profile?id=${item.uid}`)}
        >
          <Ionicons name="person-outline" size={16} color={colors.primary} />
          <Text style={styles.actionButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
          <Ionicons name="add-circle-outline" size={16} color={colors.white} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>Assign Task</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Workers</Text>
          <Text style={styles.headerSubtitle}>{filteredWorkers.length} workers</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(admin)/add-worker')}>
          <Ionicons name="person-add" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <FilterChip label="All" value="all" />
        <FilterChip label="Active" value="active" />
        <FilterChip label="Inactive" value="inactive" />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading workers...</Text>
        </View>
      ) : filteredWorkers.length > 0 ? (
        <FlatList
          data={filteredWorkers}
          renderItem={({ item }) => <WorkerCard item={item} />}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No workers found</Text>
          <Text style={styles.emptySubtext}>Add workers to get started</Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: colors.white,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: 20,
  },
  workerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  workerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  workerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  workerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  contactText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
    gap: 6,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionButtonTextPrimary: {
    color: colors.white,
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
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default AdminWorkers;
