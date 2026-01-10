import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecyclingItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  recyclable: boolean;
  info: string;
  tips: string[];
}

const RecyclingInfo = () => {
  const [selectedItem, setSelectedItem] = useState<RecyclingItem | null>(null);

  const items: RecyclingItem[] = [
    {
      id: 'plastic',
      title: 'Plastic',
      icon: 'flask',
      color: '#0284C7',
      bgColor: '#E0F2FE',
      recyclable: true,
      info: 'Most plastic bottles, containers, and packaging can be recycled. Look for recycling symbols #1-7.',
      tips: [
        'Rinse containers before recycling',
        'Remove caps and lids',
        'Check local recycling guidelines',
        'Avoid black plastic (hard to sort)',
      ],
    },
    {
      id: 'paper',
      title: 'Paper & Cardboard',
      icon: 'document-text',
      color: '#D97706',
      bgColor: '#FEF3C7',
      recyclable: true,
      info: 'Paper, cardboard, newspapers, and magazines are widely recyclable.',
      tips: [
        'Keep paper dry and clean',
        'Flatten cardboard boxes',
        'Remove tape and staples',
        'No greasy or food-soiled paper',
      ],
    },
    {
      id: 'glass',
      title: 'Glass',
      icon: 'wine',
      color: '#16A34A',
      bgColor: '#DCFCE7',
      recyclable: true,
      info: 'Glass bottles and jars are 100% recyclable and can be recycled endlessly.',
      tips: [
        'Rinse before recycling',
        'Remove caps and lids',
        'Separate by color if required',
        'No broken glass in regular bins',
      ],
    },
    {
      id: 'metal',
      title: 'Metal',
      icon: 'hardware-chip',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      recyclable: true,
      info: 'Aluminum cans, steel cans, and other metal containers are highly recyclable.',
      tips: [
        'Crush cans to save space',
        'Rinse food containers',
        'Include aluminum foil',
        'Remove paper labels if possible',
      ],
    },
    {
      id: 'organic',
      title: 'Organic Waste',
      icon: 'leaf',
      color: '#15803D',
      bgColor: '#F0FDF4',
      recyclable: false,
      info: 'Organic waste includes food scraps, yard waste, and biodegradable materials.',
      tips: [
        'Compost at home or use green bins',
        'Avoid meat and dairy in home compost',
        'Use for nutrient-rich soil',
        'Reduces methane in landfills',
      ],
    },
    {
      id: 'ewaste',
      title: 'E-Waste',
      icon: 'phone-portrait',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      recyclable: true,
      info: 'Electronics contain valuable materials and hazardous substances requiring special recycling.',
      tips: [
        'Take to e-waste collection centers',
        'Delete personal data first',
        'Donate working electronics',
        'Never throw in regular trash',
      ],
    },
    {
      id: 'hazardous',
      title: 'Hazardous Waste',
      icon: 'warning',
      color: '#EA580C',
      bgColor: '#FFEDD5',
      recyclable: false,
      info: 'Batteries, chemicals, paints, and oils require special handling and disposal.',
      tips: [
        'Use designated collection points',
        'Store safely until disposal',
        'Never pour down drains',
        'Check local hazardous waste days',
      ],
    },
    {
      id: 'textile',
      title: 'Textiles',
      icon: 'shirt',
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      recyclable: true,
      info: 'Clothes, shoes, and fabrics can be donated, recycled, or repurposed.',
      tips: [
        'Donate wearable clothing',
        'Use textile recycling bins',
        'Repurpose old fabrics',
        'Buy sustainable fashion',
      ],
    },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recycling Guide</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Why Recycle?</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="leaf" size={24} color="#16A34A" />
                <Text style={styles.statValue}>75%</Text>
                <Text style={styles.statLabel}>Less Energy</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="water" size={24} color="#0284C7" />
                <Text style={styles.statValue}>90%</Text>
                <Text style={styles.statLabel}>Less Water</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cloud" size={24} color="#6B7280" />
                <Text style={styles.statValue}>95%</Text>
                <Text style={styles.statLabel}>Less CO₂</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Material Categories</Text>
          
          <View style={styles.itemsGrid}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => setSelectedItem(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.itemIcon, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon as any} size={32} color={item.color} />
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.recyclable && (
                  <View style={styles.recyclableBadge}>
                    <Ionicons name="refresh" size={12} color="#16A34A" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {selectedItem && (
          <View style={styles.modal}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              onPress={() => setSelectedItem(null)}
              activeOpacity={1}
            />
            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: selectedItem.bgColor }]}>
                <Ionicons name={selectedItem.icon as any} size={48} color={selectedItem.color} />
              </View>
              
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              
              {selectedItem.recyclable ? (
                <View style={[styles.statusBadge, styles.recyclableBadgeModal]}>
                  <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                  <Text style={styles.recyclableText}>Recyclable</Text>
                </View>
              ) : (
                <View style={[styles.statusBadge, styles.nonRecyclableBadge]}>
                  <Ionicons name="close-circle" size={16} color="#DC2626" />
                  <Text style={styles.nonRecyclableText}>Special Handling Required</Text>
                </View>
              )}

              <Text style={styles.modalInfo}>{selectedItem.info}</Text>

              <Text style={styles.tipsTitle}>Recycling Tips</Text>
              {selectedItem.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={selectedItem.color} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}

              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: selectedItem.color }]}
                onPress={() => setSelectedItem(null)}
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
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  itemIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  recyclableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 4,
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
    maxHeight: '80%',
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    marginBottom: 16,
  },
  recyclableBadgeModal: {
    backgroundColor: '#DCFCE7',
  },
  nonRecyclableBadge: {
    backgroundColor: '#FEE2E2',
  },
  recyclableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  nonRecyclableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  modalInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
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

export default RecyclingInfo;
