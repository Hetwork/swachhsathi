import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WorkerReports = () => {
  const { data: authUser } = useAuthUser();
  const { data: reports, isLoading } = useAllReports();
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in-progress' | 'resolved'>('all');

  const myReports = reports?.filter(r => r.assignedTo === authUser?.uid) || [];
  const filteredReports = myReports.filter(report => 
    filter === 'all' ? true : report.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
    }
  };

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

  const ReportItem = ({ item }: any) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => router.push(`/(worker)/task-details?id=${item.id}`)}
      >
        <View style={styles.reportHeader}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
          ) : (
            <View style={styles.reportImagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.reportHeaderInfo}>
            <Text style={styles.reportCategory}>{item.category || 'Garbage Report'}</Text>
            <Text style={styles.reportDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.reportLocation} numberOfLines={1}>{item.location.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.reportFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Ionicons name={statusColors.icon as any} size={14} color={statusColors.text} />
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
            </Text>
          </View>
          {item.severity && (
            <View style={styles.severityBadge}>
              <Ionicons 
                name={item.severity === 'High' ? 'alert-circle' : item.severity === 'Medium' ? 'warning' : 'information-circle'} 
                size={14} 
                color={item.severity === 'High' ? '#EF4444' : item.severity === 'Medium' ? '#F59E0B' : '#10B981'} 
              />
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>{filteredReports.length} tasks</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FilterChip label="All" value="all" />
        <FilterChip label="Assigned" value="assigned" />
        <FilterChip label="In Progress" value="in-progress" />
        <FilterChip label="Completed" value="resolved" />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : filteredReports.length > 0 ? (
        <FlatList
          data={filteredReports}
          renderItem={({ item }) => <ReportItem item={item} />}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tasks found</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
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
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reportImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  reportImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportHeaderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  reportCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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

export default WorkerReports;
