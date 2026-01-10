import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HelpFAQ = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How do I report a garbage issue?',
      answer: 'Tap on the "New Report" button from the home screen or reports tab. Take a photo of the garbage, add a description, and your location will be automatically detected. Submit the report and our team will review it.',
    },
    {
      category: 'Getting Started',
      question: 'Do I need to create an account?',
      answer: 'Yes, you need to create an account to report issues and track your submissions. This helps us maintain accountability and keep you updated on the status of your reports.',
    },
    {
      category: 'Reports',
      question: 'How long does it take to resolve a report?',
      answer: 'Resolution time depends on the severity and location of the issue. Typically, reports are assigned within 24 hours and resolved within 2-5 business days. You can track the status in real-time from the Reports tab.',
    },
    {
      category: 'Reports',
      question: 'Can I edit or delete my report?',
      answer: 'You can view all your submitted reports in the Reports tab. However, once submitted, reports cannot be edited to maintain integrity. If you need to add information, contact support with your report ID.',
    },
    {
      category: 'Reports',
      question: 'What happens after I submit a report?',
      answer: 'After submission, your report is reviewed by our admin team. Once verified, it\'s assigned to a field worker who will visit the location and resolve the issue. You\'ll receive notifications at each stage.',
    },
    {
      category: 'Tracking',
      question: 'How do I track my report status?',
      answer: 'Go to the Reports tab to see all your submissions. Each report shows its current status: Pending (under review), Assigned (worker assigned), In Progress (being resolved), or Resolved (completed).',
    },
    {
      category: 'Tracking',
      question: 'Will I get notifications about my reports?',
      answer: 'Yes! You\'ll receive push notifications when your report is assigned to a worker and when it\'s marked as resolved. Make sure notifications are enabled in your device settings.',
    },
    {
      category: 'Account',
      question: 'How do I change my profile information?',
      answer: 'Go to Profile > Edit Profile to update your name, phone number, and profile photo. Your email cannot be changed as it\'s tied to your account authentication.',
    },
    {
      category: 'Account',
      question: 'I forgot my password. What should I do?',
      answer: 'On the login screen, tap "Forgot Password?" and enter your registered email. You\'ll receive a password reset link to create a new password.',
    },
    {
      category: 'Technical',
      question: 'The app is not detecting my location. What should I do?',
      answer: 'Make sure you\'ve granted location permissions to the app in your device settings. Also ensure GPS/Location services are enabled. If the issue persists, try restarting the app.',
    },
    {
      category: 'Technical',
      question: 'Why can\'t I upload photos?',
      answer: 'Check that you\'ve granted camera and storage permissions to the app. Also ensure you have enough storage space on your device. Photos should be under 5MB in size.',
    },
    {
      category: 'General',
      question: 'Is this service free to use?',
      answer: 'Yes, Swachhsathi is completely free for citizens. Our goal is to make it easy for everyone to contribute to keeping our city clean.',
    },
    {
      category: 'General',
      question: 'Can I report issues outside my area?',
      answer: 'Yes, you can report garbage issues from any location within the city. Your GPS location will be automatically tagged to help workers find the exact spot.',
    },
  ];

  const categories = ['Getting Started', 'Reports', 'Tracking', 'Account', 'Technical', 'General'];

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return 'rocket-outline';
      case 'Reports':
        return 'document-text-outline';
      case 'Tracking':
        return 'location-outline';
      case 'Account':
        return 'person-outline';
      case 'Technical':
        return 'settings-outline';
      case 'General':
        return 'help-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <Ionicons name="information-circle" size={48} color={colors.primary} />
          <Text style={styles.introTitle}>How can we help you?</Text>
          <Text style={styles.introText}>
            Find answers to common questions about using Swachhsathi. If you need further assistance, contact our support team.
          </Text>
        </View>

        {categories.map((category) => {
          const categoryFAQs = faqs.filter(faq => faq.category === category);
          if (categoryFAQs.length === 0) return null;

          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={getCategoryIcon(category) as any} size={22} color={colors.primary} />
                <Text style={styles.categoryTitle}>{category}</Text>
              </View>

              {categoryFAQs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq);
                const isExpanded = expandedId === globalIndex;

                return (
                  <TouchableOpacity
                    key={globalIndex}
                    style={styles.faqCard}
                    onPress={() => toggleExpand(globalIndex)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Ionicons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={20} 
                        color={colors.textSecondary} 
                      />
                    </View>
                    {isExpanded && (
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        <View style={styles.contactCard}>
          <Ionicons name="chatbubble-ellipses" size={32} color={colors.primary} />
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactText}>
            Our support team is here to assist you with any questions or issues.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="mail" size={18} color={colors.white} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  introCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  faqCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E7EB',
  },
  contactCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});

export default HelpFAQ;
