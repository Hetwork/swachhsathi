import Container from '@/component/Container';
import { useAllReports } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminReports = () => {
  const { data: reports, isLoading } = useAllReports();
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'in-progress' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B', icon: 'time-outline' };
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredReports = reports?.filter(report => {
    const statusMatch = filter === 'all' ? true : report.status === filter;
    const severityMatch = severityFilter === 'all' ? true : report.severity === severityFilter;
    return statusMatch && severityMatch;
  }) || [];

  const FilterChip = ({ label, value, active, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ReportItem = ({ item }: any) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => router.push(`/(admin)/report-details?id=${item.id}`)}
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
            <Text style={styles.reportCategory}>{item.category}</Text>
            <View style={styles.userRow}>
              <Ionicons name="person-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.userName}>{item.userName}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.reportLocation} numberOfLines={1}>{item.location.address}</Text>
            </View>
            <Text style={styles.reportTime}>{getTimeAgo(item.createdAt)}</Text>
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
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.assignButton}>
              <Ionicons name="person-add" size={14} color={colors.primary} />
              <Text style={styles.assignButtonText}>Assign</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Reports</Text>
          <Text style={styles.headerSubtitle}>{filteredReports.length} reports</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => router.push('/(admin)/map-view')}
          >
            <Ionicons name="map" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <FilterChip label="All" value="all" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Pending" value="pending" active={filter === 'pending'} onPress={() => setFilter('pending')} />
          <FilterChip label="Assigned" value="assigned" active={filter === 'assigned'} onPress={() => setFilter('assigned')} />
          <FilterChip label="In Progress" value="in-progress" active={filter === 'in-progress'} onPress={() => setFilter('in-progress')} />
          <FilterChip label="Resolved" value="resolved" active={filter === 'resolved'} onPress={() => setFilter('resolved')} />
        </ScrollView>

        <Text style={[styles.filterLabel, { marginTop: 16 }]}>Severity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <FilterChip label="All" value="all" active={severityFilter === 'all'} onPress={() => setSeverityFilter('all')} />
          <FilterChip label="High" value="High" active={severityFilter === 'High'} onPress={() => setSeverityFilter('High')} />
          <FilterChip label="Medium" value="Medium" active={severityFilter === 'Medium'} onPress={() => setSeverityFilter('Medium')} />
          <FilterChip label="Low" value="Low" active={severityFilter === 'Low'} onPress={() => setSeverityFilter('Low')} />
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
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
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No reports found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
  },
  filtersSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  userName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
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
  reportTime: {
    fontSize: 12,
    color: colors.textSecondary,
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
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    gap: 4,
    marginLeft: 'auto',
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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

export default AdminReports;
