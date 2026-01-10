import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useAllReports } from '@/firebase/hooks/useReport';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CitizenScore = () => {
  const { data: authUser } = useAuthUser();
  const { data: reports } = useAllReports();

  // Calculate user's reports
  const userReports = reports?.filter(r => r.userId === authUser?.uid) || [];
  const resolvedReports = userReports.filter(r => r.status === 'resolved').length;
  const totalReports = userReports.length;
  
  // Calculate score (out of 1000)
  const baseScore = totalReports * 50;
  const resolutionBonus = resolvedReports * 100;
  const citizenScore = Math.min(baseScore + resolutionBonus, 1000);
  
  // Calculate level
  const getLevel = (score: number) => {
    if (score >= 800) return { title: 'Planet Protector', icon: 'shield-checkmark', color: '#F59E0B' };
    if (score >= 600) return { title: 'Eco Champion', icon: 'trophy', color: '#8B5CF6' };
    if (score >= 400) return { title: 'Green Guardian', icon: 'star', color: '#16A34A' };
    if (score >= 200) return { title: 'Environmental Helper', icon: 'leaf', color: '#10B981' };
    return { title: 'Eco Beginner', icon: 'rocket', color: '#6B7280' };
  };

  const level = getLevel(citizenScore);

  const achievements = [
    { 
      title: 'First Report', 
      description: 'Submit your first report', 
      earned: totalReports >= 1,
      icon: 'document-text',
      color: '#0284C7'
    },
    { 
      title: 'Problem Solver', 
      description: 'Get 5 reports resolved', 
      earned: resolvedReports >= 5,
      icon: 'checkmark-circle',
      color: '#16A34A'
    },
    { 
      title: 'Community Hero', 
      description: 'Submit 10 reports', 
      earned: totalReports >= 10,
      icon: 'people',
      color: '#8B5CF6'
    },
    { 
      title: 'Consistency', 
      description: 'Report issues weekly', 
      earned: false,
      icon: 'calendar',
      color: '#F59E0B'
    },
  ];

  const impactStats = [
    { 
      label: 'Reports Submitted', 
      value: totalReports.toString(), 
      icon: 'document-text', 
      color: '#0284C7',
      description: 'Issues reported'
    },
    { 
      label: 'Problems Solved', 
      value: resolvedReports.toString(), 
      icon: 'checkmark-done', 
      color: '#16A34A',
      description: 'Resolved reports'
    },
    { 
      label: 'Community Impact', 
      value: `${(totalReports * 2.5).toFixed(1)}kg`, 
      icon: 'trash', 
      color: '#DC2626',
      description: 'Waste collected'
    },
    { 
      label: 'CO₂ Saved', 
      value: `${(totalReports * 1.2).toFixed(1)}kg`, 
      icon: 'leaf', 
      color: '#15803D',
      description: 'Carbon offset'
    },
  ];

  const badges = [
    { level: 0, title: 'Eco Beginner', minScore: 0, icon: 'rocket', color: '#6B7280' },
    { level: 1, title: 'Environmental Helper', minScore: 200, icon: 'leaf', color: '#10B981' },
    { level: 2, title: 'Green Guardian', minScore: 400, icon: 'star', color: '#16A34A' },
    { level: 3, title: 'Eco Champion', minScore: 600, icon: 'trophy', color: '#8B5CF6' },
    { level: 4, title: 'Planet Protector', minScore: 800, icon: 'shield-checkmark', color: '#F59E0B' },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Citizen Score</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.scoreCard}>
            <View style={[styles.levelBadge, { backgroundColor: `${level.color}15` }]}>
              <Ionicons name={level.icon as any} size={48} color={level.color} />
            </View>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.scoreValue}>{citizenScore}</Text>
            <Text style={styles.scoreLabel}>Citizen Score</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(citizenScore / 1000) * 100}%`, backgroundColor: level.color }]} />
              </View>
              <Text style={styles.progressText}>
                {citizenScore < 1000 ? `${1000 - citizenScore} points to max level` : 'Maximum level reached!'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.impactGrid}>
            {impactStats.map((stat, index) => (
              <View key={index} style={styles.impactCard}>
                <View style={[styles.impactIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon as any} size={28} color={stat.color} />
                </View>
                <Text style={styles.impactValue}>{stat.value}</Text>
                <Text style={styles.impactLabel}>{stat.label}</Text>
                <Text style={styles.impactDescription}>{stat.description}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementCard, !achievement.earned && styles.lockedAchievement]}>
                <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}15` }]}>
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={32} 
                    color={achievement.earned ? achievement.color : '#9CA3AF'} 
                  />
                </View>
                <View style={styles.achievementContent}>
                  <View style={styles.achievementHeader}>
                    <Text style={[styles.achievementTitle, !achievement.earned && styles.lockedText]}>
                      {achievement.title}
                    </Text>
                    {achievement.earned && (
                      <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                    )}
                  </View>
                  <Text style={[styles.achievementDescription, !achievement.earned && styles.lockedText]}>
                    {achievement.description}
                  </Text>
                </View>
                {!achievement.earned && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                  </View>
                )}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Level Progression</Text>
          <View style={styles.badgesList}>
            {badges.map((badge, index) => {
              const isUnlocked = citizenScore >= badge.minScore;
              const isCurrent = level.title === badge.title;
              
              return (
                <View key={index} style={[styles.badgeRow, isCurrent && styles.currentBadge]}>
                  <View style={[styles.badgeLevelIcon, { backgroundColor: isUnlocked ? `${badge.color}15` : '#F3F4F6' }]}>
                    <Ionicons 
                      name={badge.icon as any} 
                      size={24} 
                      color={isUnlocked ? badge.color : '#9CA3AF'} 
                    />
                  </View>
                  <View style={styles.badgeInfo}>
                    <Text style={[styles.badgeTitle, !isUnlocked && styles.lockedText]}>
                      {badge.title}
                    </Text>
                    <Text style={[styles.badgeMinScore, !isUnlocked && styles.lockedText]}>
                      {badge.minScore} points required
                    </Text>
                  </View>
                  {isCurrent && (
                    <View style={styles.currentBadgeTag}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                  {isUnlocked && !isCurrent && (
                    <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                  )}
                  {!isUnlocked && (
                    <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.motivationCard}>
            <Ionicons name="sparkles" size={32} color="#8B5CF6" />
            <Text style={styles.motivationTitle}>Keep Going!</Text>
            <Text style={styles.motivationText}>
              Every report you submit helps create a cleaner environment. 
              Your actions inspire others to take care of our planet.
            </Text>
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
  scoreCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  levelBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  impactCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  impactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  impactDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    position: 'relative',
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  achievementDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badgesList: {
    gap: 12,
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  currentBadge: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  badgeLevelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  badgeMinScore: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  currentBadgeTag: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  motivationCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B21A8',
    marginTop: 12,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#6B21A8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CitizenScore;
