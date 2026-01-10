import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConservationTip {
  id: string;
  category: string;
  title: string;
  description: string;
  savings: string;
  icon: string;
  color: string;
}

const WaterManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'bathroom', 'kitchen', 'outdoor', 'habits'];

  const tips: ConservationTip[] = [
    {
      id: '1',
      category: 'bathroom',
      title: 'Fix Leaky Faucets',
      description: 'A dripping faucet can waste up to 3,000 gallons per year. Check and repair leaks promptly.',
      savings: 'Save 3,000 gal/year',
      icon: 'water',
      color: '#0284C7',
    },
    {
      id: '2',
      category: 'bathroom',
      title: 'Shorter Showers',
      description: 'Reduce shower time by 2-3 minutes. Install low-flow showerheads to save even more water.',
      savings: 'Save 10 gal/day',
      icon: 'rainy',
      color: '#0EA5E9',
    },
    {
      id: '3',
      category: 'kitchen',
      title: 'Full Loads Only',
      description: 'Only run dishwashers and washing machines with full loads to maximize water efficiency.',
      savings: 'Save 50 gal/week',
      icon: 'business',
      color: '#3B82F6',
    },
    {
      id: '4',
      category: 'kitchen',
      title: 'Reuse Water',
      description: 'Save water used for washing vegetables to water plants. Use a basin instead of running tap.',
      savings: 'Save 5 gal/day',
      icon: 'refresh',
      color: '#06B6D4',
    },
    {
      id: '5',
      category: 'outdoor',
      title: 'Rainwater Harvesting',
      description: 'Collect rainwater in barrels or tanks for garden watering and outdoor cleaning.',
      savings: 'Save 100+ gal/week',
      icon: 'umbrella',
      color: '#8B5CF6',
    },
    {
      id: '6',
      category: 'outdoor',
      title: 'Smart Irrigation',
      description: 'Water gardens early morning or evening to reduce evaporation. Use drip irrigation systems.',
      savings: 'Save 25 gal/week',
      icon: 'leaf',
      color: '#16A34A',
    },
    {
      id: '7',
      category: 'habits',
      title: 'Turn Off Taps',
      description: 'Turn off water while brushing teeth, soaping hands, or lathering in the shower.',
      savings: 'Save 8 gal/day',
      icon: 'hand-left',
      color: '#F59E0B',
    },
    {
      id: '8',
      category: 'habits',
      title: 'Use Bucket for Car',
      description: 'Wash cars with a bucket and sponge instead of a running hose.',
      savings: 'Save 80 gal/wash',
      icon: 'car',
      color: '#DC2626',
    },
  ];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const stats = [
    { label: 'Global Usage', value: '3.8T', unit: 'liters/day', icon: 'globe' },
    { label: 'Household Use', value: '300L', unit: 'per person/day', icon: 'home' },
    { label: 'Potential Savings', value: '30%', unit: 'with conservation', icon: 'trending-down' },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Water Conservation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <Ionicons name="water" size={48} color="#0284C7" />
            <Text style={styles.heroTitle}>Save Every Drop</Text>
            <Text style={styles.heroSubtitle}>
              Water is precious. Small changes create big impacts.
            </Text>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={24} color="#0284C7" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tipsList}>
            {filteredTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}15` }]}>
                  <Ionicons name={tip.icon as any} size={28} color={tip.color} />
                </View>
                <View style={styles.tipContent}>
                  <View style={styles.tipHeader}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <View style={[styles.savingsBadge, { backgroundColor: `${tip.color}15` }]}>
                      <Text style={[styles.savingsText, { color: tip.color }]}>
                        {tip.savings}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actionCard}>
            <Ionicons name="checkmark-circle" size={32} color="#16A34A" />
            <Text style={styles.actionTitle}>Take Action Today</Text>
            <Text style={styles.actionText}>
              Start with one conservation tip and gradually adopt more. 
              Every gallon saved contributes to a sustainable future.
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
  heroCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#075985',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#075985',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingBottom: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  tipsList: {
    gap: 16,
  },
  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  tipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipHeader: {
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actionCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginTop: 12,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WaterManagement;
