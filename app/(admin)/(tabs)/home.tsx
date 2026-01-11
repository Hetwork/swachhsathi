import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useNGOReports, useNGOReportStats } from '@/firebase/hooks/useNGOReports';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminHome = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const { data: reports, isLoading } = useNGOReports(userData?.ngoId);
  const { data: reportStats } = useNGOReportStats(userData?.ngoId);

  const stats = reportStats || {
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
  };

  const StatCard = ({ icon, title, value, color, bgColor }: any) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color={colors.white} />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', text: '#F59E0B', icon: 'time-outline' };
      case 'assigned':
        return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress':
        return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved':
        return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
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

  const RecentActivityItem = ({ report }: any) => {
    const statusColors = getStatusColor(report.status);
    return (
      <TouchableOpacity
        style={styles.activityItem}
        onPress={() => router.push(`../report-details?id=${report.id}`)}
      >
        <View style={styles.activityHeader}>
          {report.imageUrl ? (
            <Image source={{ uri: report.imageUrl }} style={styles.activityImage} />
          ) : (
            <View style={styles.activityImagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.activityHeaderInfo}>
            <Text style={styles.activityCategory}>{report.category || 'General Report'}</Text>
            <View style={styles.activityUserRow}>
              <Ionicons name="person-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.activityUserName}>{report.userName}</Text>
            </View>
            <View style={styles.activityLocationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.activityLocation} numberOfLines={1}>
                {report.location?.address || 'Unknown location'}
              </Text>
            </View>
            <Text style={styles.activityTime}>{getTimeAgo(report.updatedAt || report.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.activityDescription} numberOfLines={2}>
          {report.description || 'No description provided'}
        </Text>

        <View style={styles.activityFooter}>
          <View style={[styles.activityStatusBadge, { backgroundColor: statusColors.bg }]}>
            <Ionicons name={statusColors.icon as any} size={14} color={statusColors.text} />
            <Text style={[styles.activityStatusText, { color: statusColors.text }]} numberOfLines={1}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace(/-/g, ' ')}
            </Text>
          </View>
          {report.severity && (
            <View style={styles.activitySeverityBadge}>
              <Ionicons
                name={report.severity === 'High' ? 'alert-circle' : report.severity === 'Medium' ? 'warning' : 'information-circle'}
                size={14}
                color={report.severity === 'High' ? '#EF4444' : report.severity === 'Medium' ? '#F59E0B' : '#10B981'}
              />
              <Text style={styles.activitySeverityText}>{report.severity}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('../notifications')}
          >
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
            onPress={() => router.push('./reports')}
          />
          <QuickActionCard
            icon="people"
            title="Manage Workers"
            subtitle="View and manage worker accounts"
            color="#8B5CF6"
            onPress={() => router.push('./workers')}
          />
          <QuickActionCard
            icon="map"
            title="Hotspot Map"
            subtitle="View garbage hotspots on map"
            color="#F59E0B"
            onPress={() => router.push('../map-view')}
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
              <TouchableOpacity onPress={() => router.push('./reports')}>
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
    padding: 20,
    gap: 16,
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
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
  activityHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  activityImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  activityImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityHeaderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  activityCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activityUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  activityUserName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activityLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    flexShrink: 1,
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activitySeverityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activitySeverityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default AdminHome;
