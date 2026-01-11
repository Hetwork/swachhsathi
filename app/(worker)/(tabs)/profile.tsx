import ConfirmationModal from '@/component/ConfirmationModal';
import Container from '@/component/Container';
import { useAuthUser, useSignOut } from '@/firebase/hooks/useAuth';
import { useNGO } from '@/firebase/hooks/useNGO';
import { useAllReports } from '@/firebase/hooks/useReport';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WorkerProfile = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData, isLoading } = useUser(authUser?.uid);
  const { data: ngoData } = useNGO(userData?.ngoId);
  const { data: reports } = useAllReports();
  const signOut = useSignOut();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const myReports = reports?.filter(r => r.assignedTo === authUser?.uid) || [];
  const stats = {
    assigned: myReports.filter(r => r.status === 'assigned' || r.status === 'in-progress').length,
    completed: myReports.filter(r => r.status === 'resolved').length,
    total: myReports.length,
    successRate: myReports.length > 0 ? Math.round((myReports.filter(r => r.status === 'resolved').length / myReports.length) * 100) : 0,
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = async () => {
    await signOut.mutateAsync();
    router.replace('/(auth)/(stack)/intro');
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  const MenuItem = ({ icon, title, onPress, color }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={color || colors.textPrimary} />
        <Text style={[styles.menuText, color && { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.name?.charAt(0).toUpperCase() || 'W'}
              </Text>
            </View>
            <View style={styles.workerBadge}>
              <Ionicons name="construct" size={20} color="#3B82F6" />
            </View>
          </View>
          <Text style={styles.name}>{userData?.name || 'Worker'}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Field Worker</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.assigned}</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {ngoData && (
          <View style={styles.ngoInfoCard}>
            <View style={styles.ngoHeader}>
              <View style={styles.ngoIconContainer}>
                <Ionicons name="business" size={24} color={colors.primary} />
              </View>
              <View style={styles.ngoHeaderText}>
                <Text style={styles.ngoTitle}>Working For</Text>
                <Text style={styles.ngoName}>{ngoData.ngoName}</Text>
              </View>
            </View>
            <View style={styles.ngoDetails}>
              <View style={styles.ngoDetailRow}>
                <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.ngoDetailLabel}>Contact:</Text>
                <Text style={styles.ngoDetailValue}>{ngoData.contactPerson}</Text>
              </View>
              <View style={styles.ngoDetailRow}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.ngoDetailLabel}>Phone:</Text>
                <Text style={styles.ngoDetailValue}>{ngoData.phone}</Text>
              </View>
              <View style={styles.ngoDetailRow}>
                <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.ngoDetailLabel}>Location:</Text>
                <Text style={styles.ngoDetailValue}>{ngoData.city}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="person-outline" title="Edit Profile" onPress={() => router.push('../edit-profile')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="list-outline" title="My Tasks" onPress={() => router.push('./reports?filter=active')} />
            <MenuItem icon="time-outline" title="Work History" onPress={() => router.push('./reports?filter=completed')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="help-circle-outline" title="Help & FAQ" onPress={() => router.push('../help-faq')} />
            <MenuItem icon="chatbubble-outline" title="Contact Support" onPress={() => router.push('../contact-support')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="document-text-outline" title="Terms & Conditions" onPress={() => router.push('../terms-conditions')} />
            <MenuItem icon="shield-checkmark-outline" title="Privacy Policy" onPress={() => router.push('../privacy-policy')} />
            <MenuItem icon="information-circle-outline" title="About" onPress={() => router.push('../about-us')} />
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Worker App v1.0.0</Text>
      </ScrollView>

      <ConfirmationModal
        visible={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out of your worker account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        icon="log-out-outline"
        iconColor={colors.error || '#EF4444'}
        confirmColor={colors.error || '#EF4444'}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  workerBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ngoInfoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  ngoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#F3F4F6',
  },
  ngoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ngoHeaderText: {
    flex: 1,
  },
  ngoTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  ngoName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ngoDetails: {
    gap: 12,
  },
  ngoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ngoDetailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    width: 80,
  },
  ngoDetailValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error || '#EF4444',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});

export default WorkerProfile;
