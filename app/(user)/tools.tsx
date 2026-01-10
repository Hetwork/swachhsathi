import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Tools = () => {
  const tools = [
    {
      id: 1,
      icon: 'scan',
      title: 'Waste Scanner',
      subtitle: 'Identify waste type',
      bgColor: '#E0F2FE',
      iconColor: '#0284C7',
      route: '/(user)/waste-scanner',
    },
    {
      id: 2,
      icon: 'leaf',
      title: 'Recycling Info',
      subtitle: 'Learn to recycle',
      bgColor: '#DCFCE7',
      iconColor: '#16A34A',
      route: '/(user)/recycling-info',
    },
    {
      id: 3,
      icon: 'ticket',
      title: 'Recycling Ticket',
      subtitle: 'Track recycling rewards',
      bgColor: '#FEF3C7',
      iconColor: '#F59E0B',
      route: '/(user)/recycling-ticket',
    },
    {
      id: 4,
      icon: 'restaurant',
      title: 'Food Saver',
      subtitle: 'Reduce food waste',
      bgColor: '#FECACA',
      iconColor: '#DC2626',
      route: '/(user)/food-saver',
    },
    {
      id: 5,
      icon: 'water',
      title: 'Water Management',
      subtitle: 'Conservation tips',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB',
      route: '/(user)/water-management',
    },
    {
      id: 6,
      icon: 'star',
      title: 'Citizen Score',
      subtitle: 'Track your impact',
      bgColor: '#E9D5FF',
      iconColor: '#9333EA',
      route: '/(user)/citizen-score',
    },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tools</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.toolsGrid}>
            {tools.map((tool) => (
              <TouchableOpacity 
                key={tool.id} 
                style={styles.toolCard}
                activeOpacity={0.7}
                onPress={() => router.push(tool.route as any)}
              >
                <View style={[styles.toolIconContainer, { backgroundColor: tool.bgColor }]}>
                  <Ionicons name={tool.icon as any} size={32} color={tool.iconColor} />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
              </TouchableOpacity>
            ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toolIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  toolSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default Tools;
