import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Reward {
  id: string;
  title: string;
  points: number;
  date: string;
  icon: string;
  color: string;
}

const RecyclingTicket = () => {
  const { data: authUser } = useAuthUser();

  // Mock data - in real app, fetch from Firestore
  const userPoints = 450;
  const rewardsHistory: Reward[] = [
    {
      id: '1',
      title: 'Plastic Recycled',
      points: 50,
      date: '2 days ago',
      icon: 'flask',
      color: '#0284C7',
    },
    {
      id: '2',
      title: 'Report Verified',
      points: 100,
      date: '5 days ago',
      icon: 'checkmark-circle',
      color: '#16A34A',
    },
    {
      id: '3',
      title: 'Paper Recycled',
      points: 30,
      date: '1 week ago',
      icon: 'document-text',
      color: '#D97706',
    },
    {
      id: '4',
      title: 'Glass Recycled',
      points: 40,
      date: '1 week ago',
      icon: 'wine',
      color: '#8B5CF6',
    },
  ];

  const badges = [
    { title: 'Eco Warrior', points: 500, unlocked: false, icon: 'shield', color: '#F59E0B' },
    { title: 'Recycling Pro', points: 300, unlocked: true, icon: 'star', color: '#16A34A' },
    { title: 'Green Hero', points: 100, unlocked: true, icon: 'leaf', color: '#10B981' },
    { title: 'Starter', points: 0, unlocked: true, icon: 'rocket', color: '#6B7280' },
  ];

  const milestones = [
    { points: 100, reward: 'Green Hero Badge', achieved: true },
    { points: 300, reward: 'Recycling Pro Badge', achieved: true },
    { points: 500, reward: 'Eco Warrior Badge', achieved: false },
    { points: 1000, reward: 'Planet Protector Badge', achieved: false },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recycling Rewards</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsIconContainer}>
              <Ionicons name="ticket" size={48} color="#F59E0B" />
            </View>
            <Text style={styles.pointsLabel}>Your Points</Text>
            <Text style={styles.pointsValue}>{userPoints}</Text>
            <Text style={styles.pointsSubtext}>Keep recycling to earn more!</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Next Reward</Text>
                <Text style={styles.progressPoints}>{500 - userPoints} points to go</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(userPoints / 500) * 100}%` }]} />
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={[styles.badgeCard, !badge.unlocked && styles.lockedBadge]}>
                <View style={[styles.badgeIcon, { backgroundColor: `${badge.color}15` }]}>
                  <Ionicons 
                    name={badge.icon as any} 
                    size={32} 
                    color={badge.unlocked ? badge.color : '#9CA3AF'} 
                  />
                </View>
                <Text style={[styles.badgeTitle, !badge.unlocked && styles.lockedText]}>
                  {badge.title}
                </Text>
                <Text style={[styles.badgePoints, !badge.unlocked && styles.lockedText]}>
                  {badge.points}+ pts
                </Text>
                {!badge.unlocked && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                  </View>
                )}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestonesList}>
            {milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneItem}>
                <View style={[
                  styles.milestoneIcon,
                  milestone.achieved ? styles.achievedIcon : styles.pendingIcon
                ]}>
                  <Ionicons 
                    name={milestone.achieved ? 'checkmark' : 'flag'} 
                    size={20} 
                    color={milestone.achieved ? colors.white : '#9CA3AF'} 
                  />
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneReward}>{milestone.reward}</Text>
                  <Text style={styles.milestonePoints}>{milestone.points} points</Text>
                </View>
                {milestone.achieved && (
                  <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                )}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {rewardsHistory.map((reward) => (
              <View key={reward.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: `${reward.color}15` }]}>
                  <Ionicons name={reward.icon as any} size={24} color={reward.color} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{reward.title}</Text>
                  <Text style={styles.activityDate}>{reward.date}</Text>
                </View>
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>+{reward.points}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How to Earn Points</Text>
              <Text style={styles.infoText}>
                • Submit verified reports: 100 pts{'\n'}
                • Recycle materials: 30-50 pts{'\n'}
                • Help resolve issues: 75 pts{'\n'}
                • Daily login streak: 10 pts
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pointsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsIconContainer: {
    backgroundColor: colors.white,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  progressPoints: {
    fontSize: 12,
    color: '#92400E',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FDE68A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgePoints: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  milestonesList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
    gap: 12,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievedIcon: {
    backgroundColor: '#16A34A',
  },
  pendingIcon: {
    backgroundColor: '#F3F4F6',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneReward: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  milestonePoints: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
    gap: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pointsBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0C4A6E',
    lineHeight: 20,
  },
});

export default RecyclingTicket;
