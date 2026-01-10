import Container from '@/component/Container';
import { useReport } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ReportDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: report, isLoading } = useReport(id as string);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B', icon: 'time-outline' };
      case 'assigned': return { bg: '#DBEAFE', text: '#3B82F6', icon: 'person-outline' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', icon: 'sync-outline' };
      case 'resolved': return { bg: '#D1FAE5', text: '#10B981', icon: 'checkmark-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-outline' };
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Report not found</Text>
        </View>
      </Container>
    );
  }

  const statusColors = getStatusColor(report.status);

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {report.imageUrl && (
          <Image source={{ uri: report.imageUrl }} style={styles.reportImage} resizeMode='contain' />
        )}

        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Ionicons name={statusColors.icon as any} size={16} color={statusColors.text} />
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
              </Text>
            </View>
            {report.severity && (
              <View style={styles.severityBadge}>
                <Ionicons 
                  name={report.severity === 'High' ? 'alert-circle' : report.severity === 'Medium' ? 'warning' : 'information-circle'} 
                  size={16} 
                  color={report.severity === 'High' ? '#EF4444' : report.severity === 'Medium' ? '#F59E0B' : '#10B981'} 
                />
                <Text style={styles.severityText}>{report.severity} Severity</Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{report.category}</Text>
          <Text style={styles.description}>{report.description}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Report Information</Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported By</Text>
                <Text style={styles.infoValue}>{report.userName}</Text>
                <Text style={styles.infoSubtext}>{report.userEmail}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reported On</Text>
                <Text style={styles.infoValue}>{formatDate(report.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{report.location.address}</Text>
                <Text style={styles.infoSubtext}>
                  {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="map-outline" size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>View on Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                Track Status
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  reportImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  category: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
  },
});

export default ReportDetails;
