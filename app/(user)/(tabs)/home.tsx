import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useUser } from '@/firebase/hooks/useUser';
import { useUserReports } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const { data: reports, isLoading: reportsLoading } = useUserReports(authUser?.uid);

  const ActionButton = ({ icon, title, color, onPress }: any) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={28} color={colors.white} />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
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

  const ReportCard = ({ report }: any) => {
    const statusColors = getStatusColor(report.status);
    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => router.push(`/(user)/report-details?id=${report.id}`)}
      >
        {report.imageUrl ? (
          <Image source={{ uri: report.imageUrl }} style={styles.reportImage} />
        ) : (
          <View style={styles.reportImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle} numberOfLines={1}>{report.category}</Text>
          <View style={styles.reportMeta}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.reportLocation} numberOfLines={1}>{report.location.address}</Text>
          </View>
          <View style={styles.reportFooter}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.reportTime}>{getTimeAgo(report.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{userData?.name || 'User'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Keep Your City Clean</Text>
            <Text style={styles.heroSubtitle}>Report garbage issues in your area</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            icon="add-circle"
            title="New Report"
            color={colors.primary}
            onPress={() => router.push('/(user)/new-report')}
          />
          <ActionButton
            icon="document-text"
            title="My Reports"
            color="#8B5CF6"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity onPress={() => router.push('/(user)/(tabs)/reports')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {reportsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
          ) : reports && reports.length > 0 ? (
            reports.slice(0, 3).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No reports yet</Text>
              <Text style={styles.emptySubtext}>Create your first report to get started</Text>
            </View>
          )}
        </View>
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
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
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
  heroCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  reportCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  reportImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reportMeta: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default Home;