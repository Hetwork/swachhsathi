import Container from '@/component/Container';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminHome = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const { data: reports, isLoading } = useAllReports();

  const stats = {
    total: reports?.length || 0,
    pending: reports?.filter(r => r.status === 'pending').length || 0,
    assigned: reports?.filter(r => r.status === 'assigned').length || 0,
    inProgress: reports?.filter(r => r.status === 'in-progress').length || 0,
    resolved: reports?.filter(r => r.status === 'resolved').length || 0,
    highSeverity: reports?.filter(r => r.severity === 'High').length || 0,
  };

  const StatCard = ({ icon, title, value, color, bgColor }: any) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const QuickActionCard = ({ icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const RecentActivityItem = ({ report }: any) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return '#F59E0B';
        case 'assigned': return '#3B82F6';
        case 'in-progress': return '#6366F1';
        case 'resolved': return '#10B981';
        default: return '#6B7280';
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={[styles.activityDot, { backgroundColor: getStatusColor(report.status) }]} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{report.category}</Text>
          <Text style={styles.activitySubtitle}>{report.location.address}</Text>
        </View>
        <Text style={styles.activityStatus}>{report.status}</Text>
      </View>
    );
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.adminName}>{userData?.name || 'Admin'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="document-text"
            title="Total Reports"
            value={stats.total}
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
          <StatCard
            icon="time"
            title="Pending"
            value={stats.pending}
            color="#F59E0B"
            bgColor="#FEF3C7"
          />
          <StatCard
            icon="person"
            title="Assigned"
            value={stats.assigned}
            color="#8B5CF6"
            bgColor="#F3E8FF"
          />
          <StatCard
            icon="sync"
            title="In Progress"
            value={stats.inProgress}
            color="#6366F1"
            bgColor="#E0E7FF"
          />
          <StatCard
            icon="checkmark-circle"
            title="Resolved"
            value={stats.resolved}
            color="#10B981"
            bgColor="#D1FAE5"
          />
          <StatCard
            icon="alert-circle"
            title="High Priority"
            value={stats.highSeverity}
            color="#EF4444"
            bgColor="#FEE2E2"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActionCard
            icon="add-circle"
            title="Assign Reports"
            subtitle="Assign pending reports to workers"
            color="#3B82F6"
            onPress={() => {}}
          />
          <QuickActionCard
            icon="people"
            title="Manage Workers"
            subtitle="View and manage worker accounts"
            color="#8B5CF6"
            onPress={() => {}}
          />
          <QuickActionCard
            icon="stats-chart"
            title="View Analytics"
            subtitle="Reports, trends, and insights"
            color="#10B981"
            onPress={() => {}}
          />
          <QuickActionCard
            icon="map"
            title="Hotspot Map"
            subtitle="View garbage hotspots on map"
            color="#F59E0B"
            onPress={() => {}}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {reports?.slice(0, 5).map((report) => (
              <RecentActivityItem key={report.id} report={report} />
            ))}
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default AdminHome;
