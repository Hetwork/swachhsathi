import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Tip {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: string;
  color: string;
}

const FoodSaver = () => {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const tips: Tip[] = [
    {
      id: '1',
      title: 'Plan Your Meals',
      description: 'Create a weekly meal plan and shopping list to buy only what you need. This reduces impulse purchases and ensures ingredients are used before they spoil.',
      impact: 'Reduces waste by 30%',
      icon: 'calendar',
      color: '#16A34A',
    },
    {
      id: '2',
      title: 'Proper Storage',
      description: 'Store food correctly to extend freshness. Keep fruits and vegetables in the crisper, store herbs in water, and use airtight containers for leftovers.',
      impact: 'Extends freshness 2-3x',
      icon: 'cube',
      color: '#0284C7',
    },
    {
      id: '3',
      title: 'Understand Dates',
      description: '"Best before" dates indicate quality, not safety. "Use by" dates are for food safety. Many foods are safe to eat past these dates if stored properly.',
      impact: 'Prevents early disposal',
      icon: 'time',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Freeze Smart',
      description: 'Freeze surplus food before it spoils. Most foods freeze well including bread, fruit, vegetables, and cooked meals. Label with dates.',
      impact: 'Saves up to 50% waste',
      icon: 'snow',
      color: '#3B82F6',
    },
    {
      id: '5',
      title: 'Use Leftovers',
      description: 'Transform leftovers into new meals. Vegetable scraps make great soup stock, stale bread becomes croutons, and overripe fruit is perfect for smoothies.',
      impact: 'Zero waste cooking',
      icon: 'restaurant',
      color: '#8B5CF6',
    },
    {
      id: '6',
      title: 'Composting',
      description: 'Compost unavoidable food waste like peels, cores, and coffee grounds. This creates nutrient-rich soil and reduces methane in landfills.',
      impact: 'Diverts 30% from landfill',
      icon: 'leaf',
      color: '#15803D',
    },
  ];

  const stats = [
    { label: 'Global Food Waste', value: '931M', unit: 'tons/year', icon: 'planet', color: '#DC2626' },
    { label: 'Household Waste', value: '61%', unit: 'of total', icon: 'home', color: '#F59E0B' },
    { label: 'Water Used', value: '70%', unit: 'wasted', icon: 'water', color: '#0284C7' },
    { label: 'CO₂ Emissions', value: '8%', unit: 'global', icon: 'cloud', color: '#6B7280' },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Saver</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <Ionicons name="restaurant" size={48} color="#DC2626" />
            <Text style={styles.heroTitle}>Reduce Food Waste</Text>
            <Text style={styles.heroSubtitle}>
              Every meal saved makes a difference for our planet
            </Text>
          </View>

          <Text style={styles.sectionTitle}>The Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={32} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tips to Reduce Waste</Text>
          <View style={styles.tipsList}>
            {tips.map((tip) => (
              <TouchableOpacity
                key={tip.id}
                style={styles.tipCard}
                onPress={() => setSelectedTip(tip)}
                activeOpacity={0.7}
              >
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}15` }]}>
                  <Ionicons name={tip.icon as any} size={24} color={tip.color} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipImpact}>{tip.impact}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Start Today!</Text>
            <Text style={styles.actionText}>
              Small changes in how we buy, store, and use food can make a huge difference.
              Start with one tip and build from there.
            </Text>
          </View>
        </ScrollView>

        {selectedTip && (
          <View style={styles.modal}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              onPress={() => setSelectedTip(null)}
              activeOpacity={1}
            />
            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: `${selectedTip.color}15` }]}>
                <Ionicons name={selectedTip.icon as any} size={48} color={selectedTip.color} />
              </View>
              
              <Text style={styles.modalTitle}>{selectedTip.title}</Text>
              
              <View style={[styles.impactBadge, { backgroundColor: `${selectedTip.color}15` }]}>
                <Ionicons name="trending-up" size={16} color={selectedTip.color} />
                <Text style={[styles.impactText, { color: selectedTip.color }]}>
                  {selectedTip.impact}
                </Text>
              </View>

              <Text style={styles.modalDescription}>{selectedTip.description}</Text>

              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: selectedTip.color }]}
                onPress={() => setSelectedTip(null)}
              >
                <Text style={styles.closeButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#991B1B',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tipsList: {
    gap: 12,
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tipImpact: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    padding: 20,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    marginBottom: 16,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodSaver;
