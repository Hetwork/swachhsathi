import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TermsConditions = () => {
  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
            Welcome to Swachhsathi. By accessing or using our mobile application, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
              By creating an account and using Swachhsathi, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
            <Text style={styles.text}>As a user of Swachhsathi, you agree to:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Provide accurate and truthful information when reporting garbage issues
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Upload only genuine photos related to the garbage issue being reported
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Not misuse the platform for false or malicious reports
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Respect the privacy and rights of others when using the app
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Not upload offensive, inappropriate, or illegal content
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Report Submission</Text>
            <Text style={styles.text}>
              When you submit a report through Swachhsathi, you grant us the right to share this information with municipal authorities and workers for the purpose of resolving the reported issue. Reports may include photos, location data, and descriptive information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Location Services</Text>
            <Text style={styles.text}>
              Swachhsathi uses GPS location services to accurately tag reported garbage issues. By using the app, you consent to the collection and use of your location data for this purpose. You can disable location services at any time through your device settings, but this may limit app functionality.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Account Security</Text>
            <Text style={styles.text}>
              You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access to your account. We are not liable for any loss or damage arising from your failure to protect your account information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
            <Text style={styles.text}>You agree not to:</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Submit false or fraudulent reports
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Harass, abuse, or harm other users or workers
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Attempt to gain unauthorized access to the app or its systems
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Use the app for any illegal purposes
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Reverse engineer or attempt to extract source code from the app
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.text}>
              All content, features, and functionality of Swachhsathi, including but not limited to text, graphics, logos, and software, are owned by Swachhsathi and are protected by copyright, trademark, and other intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Disclaimer of Warranties</Text>
            <Text style={styles.text}>
              Swachhsathi is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We do not guarantee the accuracy or completeness of report resolutions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
            <Text style={styles.text}>
              To the maximum extent permitted by law, Swachhsathi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Data Collection and Privacy</Text>
            <Text style={styles.text}>
              Your use of Swachhsathi is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Termination</Text>
            <Text style={styles.text}>
              We reserve the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms and Conditions or for any other reason we deem appropriate.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
            <Text style={styles.text}>
              We may update these Terms and Conditions from time to time. We will notify you of significant changes through the app or via email. Your continued use of Swachhsathi after changes are posted constitutes acceptance of the updated terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Governing Law</Text>
            <Text style={styles.text}>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>14. Contact Us</Text>
            <Text style={styles.text}>
              If you have any questions about these Terms and Conditions, please contact us through the app's support section or via email.
            </Text>
          </View>

          <View style={styles.acceptanceNote}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.acceptanceText}>
              By using Swachhsathi, you acknowledge that you have read and agree to these Terms and Conditions.
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
  acceptanceNote: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight || '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
  acceptanceText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default TermsConditions;
