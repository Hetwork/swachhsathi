import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: January 10, 2026</Text>

          <Text style={styles.intro}>
            At Swachhsathi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our mobile application.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subTitle}>1.1 Personal Information</Text>
            <Text style={styles.text}>When you create an account, we collect:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Name</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Email address</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Phone number (optional)</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Profile photo (optional)</Text>
            </View>

            <Text style={styles.subTitle}>1.2 Location Data</Text>
            <Text style={styles.text}>
              We collect precise location data (GPS coordinates) when you submit a report to accurately identify garbage locations. Location data is only collected when you actively use the reporting feature.
            </Text>

            <Text style={styles.subTitle}>1.3 Report Data</Text>
            <Text style={styles.text}>When you submit a report, we collect:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Photos of the garbage issue</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Description of the issue</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Category and severity level</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Timestamp of submission</Text>
            </View>

            <Text style={styles.subTitle}>1.4 Device Information</Text>
            <Text style={styles.text}>
              We automatically collect certain information about your device, including device model, operating system version, unique device identifiers, and mobile network information.
            </Text>

            <Text style={styles.subTitle}>1.5 Usage Data</Text>
            <Text style={styles.text}>
              We collect information about how you interact with the app, including features used, pages viewed, and actions taken.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.text}>We use your information to:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Process and manage garbage reports submitted by you
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Share reports with municipal authorities and cleanup workers
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Send you notifications about report status updates
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Improve and personalize your app experience
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Generate analytics and insights about garbage patterns
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Provide customer support and respond to your inquiries
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Detect and prevent fraud, abuse, and security issues
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.text}>We may share your information with:</Text>
            
            <Text style={styles.subTitle}>3.1 Municipal Authorities</Text>
            <Text style={styles.text}>
              Report data, including photos and location, is shared with municipal authorities to facilitate cleanup operations.
            </Text>

            <Text style={styles.subTitle}>3.2 Cleanup Workers</Text>
            <Text style={styles.text}>
              Workers assigned to your report will have access to report details including location and photos.
            </Text>

            <Text style={styles.subTitle}>3.3 Service Providers</Text>
            <Text style={styles.text}>
              We use third-party services (Firebase, Google Maps) to operate our app. These providers have access to your data only to perform services on our behalf.
            </Text>

            <Text style={styles.subTitle}>3.4 Legal Requirements</Text>
            <Text style={styles.text}>
              We may disclose your information if required by law or in response to valid legal requests.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.text}>
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Retention</Text>
            <Text style={styles.text}>
              We retain your personal information for as long as your account is active or as needed to provide services. Report data may be retained for municipal record-keeping and analytics purposes. You can request deletion of your account and data at any time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Your Rights</Text>
            <Text style={styles.text}>You have the right to:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Access your personal information
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Correct inaccurate or incomplete data
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Delete your account and associated data
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Opt-out of promotional communications
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Disable location services (may limit functionality)
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
            <Text style={styles.text}>
              Swachhsathi is not intended for users under the age of 13. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal information, we will delete it immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
            <Text style={styles.text}>Our app uses third-party services:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Firebase (Authentication, Database, Storage)
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Google Maps (Location services)
              </Text>
            </View>
            <Text style={styles.text}>
              These services have their own privacy policies governing the use of your information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Cookies and Tracking</Text>
            <Text style={styles.text}>
              We use analytics and tracking technologies to understand app usage patterns and improve performance. You can control these through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Privacy Policy</Text>
            <Text style={styles.text}>
              We may update this Privacy Policy periodically. We will notify you of significant changes through the app or via email. Your continued use after changes are posted constitutes acceptance of the updated policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.text}>
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us through the app's support section.
            </Text>
          </View>

          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.privacyText}>
              Your privacy is important to us. We are committed to protecting your personal information and being transparent about our data practices.
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
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  intro: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default PrivacyPolicy;
