import Container from '@/component/Container';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useWorkers } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Analytics = () => {
  const { data: reports, isLoading: reportsLoading } = useAllReports();
  const { data: workers, isLoading: workersLoading } = useWorkers();

  const analytics = useMemo(() => {
    if (!reports || !workers) return null;

    // Status distribution
    const pending = reports.filter(r => r.status === 'pending').length;
    const assigned = reports.filter(r => r.status === 'assigned').length;
    const inProgress = reports.filter(r => r.status === 'in-progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;

    // Severity distribution
    const low = reports.filter(r => r.severity === 'Low').length;
    const medium = reports.filter(r => r.severity === 'Medium').length;
    const high = reports.filter(r => r.severity === 'High').length;

    // Time-based analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReports = reports.filter(r => {
      const reportDate = r.createdAt?.toDate?.() || new Date(r.createdAt);
      return reportDate >= today;
    }).length;

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekReports = reports.filter(r => {
      const reportDate = r.createdAt?.toDate?.() || new Date(r.createdAt);
      return reportDate >= thisWeek;
    }).length;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthReports = reports.filter(r => {
      const reportDate = r.createdAt?.toDate?.() || new Date(r.createdAt);
      return reportDate >= thisMonth;
    }).length;

    // Worker performance
    const activeWorkers = workers.filter((w: any) => w.status === 'active').length;
    const totalWorkers = workers.length;
    const avgReportsPerWorker = totalWorkers > 0 ? (resolved / totalWorkers).toFixed(1) : '0';

    // Top performers
    const topWorkers = [...workers]
      .sort((a: any, b: any) => (b.completedReports || 0) - (a.completedReports || 0))
      .slice(0, 5);

    // Resolution rate
    const resolutionRate = reports.length > 0 ? ((resolved / reports.length) * 100).toFixed(1) : '0';
    
    // Average response time (mock calculation - days between created and resolved)
    const resolvedReportsWithTime = reports
      .filter(r => r.status === 'resolved' && r.createdAt && r.updatedAt)
      .map(r => {
        const created = r.createdAt?.toDate?.() || new Date(r.createdAt);
        const updated = r.updatedAt?.toDate?.() || new Date(r.updatedAt);
        return Math.abs(updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      });
    const avgResponseTime = resolvedReportsWithTime.length > 0 
      ? (resolvedReportsWithTime.reduce((a, b) => a + b, 0) / resolvedReportsWithTime.length).toFixed(1)
      : '0';

    // Category distribution (if available)
    const categories = reports.reduce((acc: any, report) => {
      const cat = report.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      status: { pending, assigned, inProgress, resolved },
      severity: { low, medium, high },
      time: { today: todayReports, week: weekReports, month: monthReports },
      workers: { active: activeWorkers, total: totalWorkers, avgReports: avgReportsPerWorker },
      topPerformers: topWorkers,
      metrics: { resolutionRate, avgResponseTime },
      categories,
    };
  }, [reports, workers]);

  if (reportsLoading || workersLoading) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </Container>
    );
  }

  const StatusBar = ({ label, value, total, color }: any) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <View style={styles.statusBarContainer}>
        <View style={styles.statusBarHeader}>
          <Text style={styles.statusBarLabel}>{label}</Text>
          <Text style={styles.statusBarValue}>{value}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  const MetricCard = ({ icon, value, label, color, subtext }: any) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {subtext && <Text style={styles.metricSubtext}>{subtext}</Text>}
    </View>
  );

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
              <Text style={styles.overviewValue}>{reports?.length || 0}</Text>
              <Text style={styles.overviewLabel}>Total Reports</Text>
            </View>
            <View style={styles.overviewCard}>
              <Ionicons name="people" size={32} color="#8B5CF6" />
              <Text style={styles.overviewValue}>{analytics.workers.total}</Text>
              <Text style={styles.overviewLabel}>Total Workers</Text>
            </View>
            <View style={styles.overviewCard}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.overviewValue}>{analytics.metrics.resolutionRate}%</Text>
              <Text style={styles.overviewLabel}>Resolution Rate</Text>
            </View>
            <View style={styles.overviewCard}>
              <Ionicons name="time" size={32} color="#F59E0B" />
              <Text style={styles.overviewValue}>{analytics.metrics.avgResponseTime}d</Text>
              <Text style={styles.overviewLabel}>Avg Response</Text>
            </View>
          </View>
        </View>

        {/* Time-based Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports Timeline</Text>
          <View style={styles.card}>
            <View style={styles.timelineRow}>
              <View style={styles.timelineItem}>
                <Ionicons name="today" size={20} color={colors.primary} />
                <Text style={styles.timelineLabel}>Today</Text>
                <Text style={styles.timelineValue}>{analytics.time.today}</Text>
              </View>
              <View style={styles.timelineDivider} />
              <View style={styles.timelineItem}>
                <Ionicons name="calendar" size={20} color="#3B82F6" />
                <Text style={styles.timelineLabel}>This Week</Text>
                <Text style={styles.timelineValue}>{analytics.time.week}</Text>
              </View>
              <View style={styles.timelineDivider} />
              <View style={styles.timelineItem}>
                <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                <Text style={styles.timelineLabel}>This Month</Text>
                <Text style={styles.timelineValue}>{analytics.time.month}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Status Distribution</Text>
          <View style={styles.card}>
            <StatusBar 
              label="Pending" 
              value={analytics.status.pending} 
              total={reports?.length || 1} 
              color="#F59E0B" 
            />
            <StatusBar 
              label="Assigned" 
              value={analytics.status.assigned} 
              total={reports?.length || 1} 
              color="#3B82F6" 
            />
            <StatusBar 
              label="In Progress" 
              value={analytics.status.inProgress} 
              total={reports?.length || 1} 
              color="#8B5CF6" 
            />
            <StatusBar 
              label="Resolved" 
              value={analytics.status.resolved} 
              total={reports?.length || 1} 
              color="#10B981" 
            />
          </View>
        </View>

        {/* Severity Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Severity Analysis</Text>
          <View style={styles.severityGrid}>
            <MetricCard 
              icon="arrow-down-circle" 
              value={analytics.severity.low} 
              label="Low Severity"
              color="#10B981"
              subtext={`${((analytics.severity.low / (reports?.length || 1)) * 100).toFixed(0)}%`}
            />
            <MetricCard 
              icon="remove-circle" 
              value={analytics.severity.medium} 
              label="Medium Severity"
              color="#F59E0B"
              subtext={`${((analytics.severity.medium / (reports?.length || 1)) * 100).toFixed(0)}%`}
            />
            <MetricCard 
              icon="alert-circle" 
              value={analytics.severity.high} 
              label="High Severity"
              color="#EF4444"
              subtext={`${((analytics.severity.high / (reports?.length || 1)) * 100).toFixed(0)}%`}
            />
          </View>
        </View>

        {/* Worker Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Worker Performance</Text>
          <View style={styles.card}>
            <View style={styles.workerStatsRow}>
              <View style={styles.workerStat}>
                <Text style={styles.workerStatValue}>{analytics.workers.active}</Text>
                <Text style={styles.workerStatLabel}>Active Workers</Text>
              </View>
              <View style={styles.workerStatDivider} />
              <View style={styles.workerStat}>
                <Text style={styles.workerStatValue}>{analytics.workers.avgReports}</Text>
                <Text style={styles.workerStatLabel}>Avg Reports/Worker</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          <View style={styles.card}>
            {analytics.topPerformers.length > 0 ? (
              analytics.topPerformers.map((worker: any, index: number) => (
                <View key={worker.uid} style={styles.performerRow}>
                  <View style={styles.performerRank}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerName}>{worker.name || 'Worker'}</Text>
                    <Text style={styles.performerEmail}>{worker.email}</Text>
                  </View>
                  <View style={styles.performerStats}>
                    <View style={styles.performerBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.performerBadgeText}>{worker.completedReports || 0}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No worker data available</Text>
            )}
          </View>
        </View>

        {/* Category Breakdown */}
        {Object.keys(analytics.categories).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            <View style={styles.card}>
              {Object.entries(analytics.categories).map(([category, count]: any) => (
                <View key={category} style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryCount}>{count}</Text>
                    <View style={styles.categoryBar}>
                      <View 
                        style={[
                          styles.categoryBarFill, 
                          { width: `${(count / (reports?.length || 1)) * 100}%` }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightCard}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Performance Summary</Text>
              <Text style={styles.insightText}>
                {analytics.status.resolved > analytics.status.pending 
                  ? 'Great job! More reports are being resolved than pending.'
                  : 'Attention needed: Pending reports are accumulating.'}
              </Text>
              <Text style={styles.insightText}>
                Active worker utilization: {((analytics.workers.active / analytics.workers.total) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineItem: {
    flex: 1,
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  timelineValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  timelineDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border || '#E5E7EB',
  },
  statusBarContainer: {
    marginBottom: 16,
  },
  statusBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusBarValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border || '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  severityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  metricSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  workerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerStat: {
    flex: 1,
    alignItems: 'center',
  },
  workerStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  workerStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  workerStatDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border || '#E5E7EB',
    marginHorizontal: 16,
  },
  performerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  performerEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  performerStats: {
    alignItems: 'flex-end',
  },
  performerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  performerBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: 'right',
  },
  categoryBar: {
    width: 60,
    height: 6,
    backgroundColor: colors.border || '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    gap: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default Analytics;
