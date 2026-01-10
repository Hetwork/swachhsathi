import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AboutUs = () => {
  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Swachhsathi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Swachhsathi</Text>
          <Text style={styles.tagline}>Empowering Workers, Building Cleaner Communities</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.text}>
              Swachhsathi is a comprehensive waste management platform that connects citizens, field workers, and administrators to create cleaner, healthier communities. As a worker, you are at the heart of this mission—your dedication and hard work transform citizen reports into real-world impact.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Role as a Field Worker</Text>
            <Text style={styles.text}>
              As a Swachhsathi field worker, you play a crucial role in our waste management ecosystem:
            </Text>
            
            <View style={styles.featureCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="notifications" size={24} color="#F59E0B" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Receive Task Assignments</Text>
                <Text style={styles.featureText}>
                  Get instant notifications about cleanup tasks near your location
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="navigate" size={24} color="#3B82F6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Navigate to Locations</Text>
                <Text style={styles.featureText}>
                  Use built-in maps to find reported waste sites efficiently
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="camera" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Document Your Work</Text>
                <Text style={styles.featureText}>
                  Upload before and after photos to verify task completion
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="stats-chart" size={24} color="#10B981" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Track Performance</Text>
                <Text style={styles.featureText}>
                  View your completed tasks and performance metrics
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Citizen Reports Issue</Text>
                <Text style={styles.stepText}>A citizen reports garbage through their app</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Admin Assigns Task</Text>
                <Text style={styles.stepText}>Admin reviews and assigns you the task</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>You Receive Notification</Text>
                <Text style={styles.stepText}>Get notified with task details and location</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Complete Cleanup</Text>
                <Text style={styles.stepText}>Visit location, clean up, and upload verification photos</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Mark as Complete</Text>
                <Text style={styles.stepText}>Update status and citizen gets notified of resolution</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technology Stack</Text>
            <Text style={styles.text}>Built with modern technology for reliability:</Text>
            <View style={styles.techGrid}>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>React Native</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>Firebase</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>Google Maps</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>Real-time Updates</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Impact</Text>
            <View style={styles.impactCard}>
              <Ionicons name="trophy" size={32} color="#F59E0B" />
              <Text style={styles.impactTitle}>Making a Difference</Text>
              <Text style={styles.impactText}>
                Every task you complete contributes to cleaner streets, healthier neighborhoods, and happier communities. Your work is valued and makes a real difference.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <TouchableOpacity 
              style={styles.supportButton}
              onPress={() => router.push('./contact-support')}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.white} />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Worker App Version 1.0.0</Text>
            <Text style={styles.copyright}>© 2025 Swachhsathi. All rights reserved.</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.background || '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: colors.border || '#E5E7EB',
    marginLeft: 15,
    marginVertical: 4,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  techBadge: {
    backgroundColor: colors.primaryLight || '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  impactCard: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  impactText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  supportButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E7EB',
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default AboutUs;
