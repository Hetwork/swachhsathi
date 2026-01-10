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
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Swachhsathi</Text>
          <Text style={styles.tagline}>Smart Garbage Reporting System</Text>
          <Text style={styles.version}>Admin Portal - Version 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.text}>
              Swachhsathi is dedicated to revolutionizing urban waste management through citizen participation and real-time tracking. We believe in empowering communities to take an active role in keeping their cities clean and sustainable.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We Do</Text>
            <Text style={styles.text}>
              We provide a comprehensive civic-tech platform that connects three key stakeholders - citizens, municipal workers, and administrators - in a seamless ecosystem for efficient garbage reporting and resolution.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administrator Dashboard</Text>
            <Text style={styles.text}>
              As an administrator, you have access to powerful tools to manage waste collection operations:
            </Text>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="analytics" size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-Time Analytics</Text>
                <Text style={styles.featureText}>
                  Monitor active reports, worker performance, and resolution trends
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Worker Management</Text>
                <Text style={styles.featureText}>
                  Add, manage, and track municipal workers with real-time location
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Report Assignment</Text>
                <Text style={styles.featureText}>
                  Efficiently assign cleanup tasks based on location and severity
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="map" size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Interactive Map View</Text>
                <Text style={styles.featureText}>
                  Visualize reports and worker locations on an interactive map
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="notifications" size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Instant Notifications</Text>
                <Text style={styles.featureText}>
                  Get alerts for new reports, task completion, and urgent issues
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Vision</Text>
            <Text style={styles.text}>
              We envision cities where technology bridges the gap between citizens and civic authorities, creating cleaner, healthier, and more sustainable urban environments. Through data-driven insights and community engagement, we aim to make waste management more efficient and transparent.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Report</Text>
                <Text style={styles.stepText}>
                  Citizens capture photos of garbage issues and submit reports with GPS location
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Review</Text>
                <Text style={styles.stepText}>
                  You review incoming reports, verify severity, and prioritize based on urgency
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Assign</Text>
                <Text style={styles.stepText}>
                  Assign reports to available workers based on location and workload
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Track</Text>
                <Text style={styles.stepText}>
                  Monitor worker progress in real-time and update report status
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Resolve</Text>
                <Text style={styles.stepText}>
                  Workers complete cleanup, upload verification photos, and close reports
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technology Stack</Text>
            <View style={styles.techGrid}>
              <View style={styles.techItem}>
                <Text style={styles.techText}>React Native</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Firebase</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>TypeScript</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Google Maps</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Expo</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impact</Text>
            <View style={styles.impactGrid}>
              <View style={styles.impactCard}>
                <Ionicons name="flash" size={32} color="#F59E0B" />
                <Text style={styles.impactValue}>Faster</Text>
                <Text style={styles.impactLabel}>Response Time</Text>
              </View>
              <View style={styles.impactCard}>
                <Ionicons name="trending-up" size={32} color="#3B82F6" />
                <Text style={styles.impactValue}>Higher</Text>
                <Text style={styles.impactLabel}>Efficiency</Text>
              </View>
              <View style={styles.impactCard}>
                <Ionicons name="leaf" size={32} color="#10B981" />
                <Text style={styles.impactValue}>Cleaner</Text>
                <Text style={styles.impactLabel}>Communities</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Streamlined report management with intelligent assignment
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Real-time visibility into worker locations and task status
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Data-driven insights for better resource allocation
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Improved accountability through photo verification
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Enhanced citizen satisfaction with transparent tracking
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>
                Reduced response times and operational costs
              </Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <Text style={styles.text}>
              Have questions or need assistance with the admin portal? We're here to help!
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => router.push('../contact-support')}
            >
              <Ionicons name="mail" size={20} color={colors.white} />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Built with ❤️ for a cleaner, smarter city
            </Text>
            <Text style={styles.copyright}>
              © 2026 Swachhsathi. All rights reserved.
            </Text>
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
    backgroundColor: colors.primaryLight || '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  version: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: colors.white,
    margin: 16,
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
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight || '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
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
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  stepContent: {
    flex: 1,
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
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techItem: {
    backgroundColor: colors.primaryLight || '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  techText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  impactCard: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  impactLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 10,
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default AboutUs;
