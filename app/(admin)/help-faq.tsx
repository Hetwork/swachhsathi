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
      question: 'How do I get started as an admin?',
      answer: 'After registering your NGO/organization, you can log in to the admin portal. From the dashboard, you can view all citizen reports, manage workers, assign tasks, and monitor progress in real-time.',
    },
    {
      category: 'Getting Started',
      question: 'What are my responsibilities as an administrator?',
      answer: 'As an admin, you are responsible for reviewing citizen reports, verifying their authenticity, assigning tasks to workers based on location and workload, monitoring task completion, and ensuring timely resolution of garbage issues.',
    },
    {
      category: 'Report Management',
      question: 'How do I review and assign reports?',
      answer: 'Go to the Reports tab to see all citizen-submitted reports. Each report shows location, photos, severity, and timestamp. Click on a report to view details, then tap "Assign Worker" to select an available worker from the list.',
    },
    {
      category: 'Report Management',
      question: 'Can I change the status of a report?',
      answer: 'Yes, you can update report status by opening the report details and tapping "Change Status". You can mark reports as Pending, Assigned, In Progress, or Resolved. Workers can also update status from their app.',
    },
    {
      category: 'Report Management',
      question: 'What do the different report statuses mean?',
      answer: 'Pending: New report awaiting review. Assigned: Report assigned to a worker. In Progress: Worker is actively resolving the issue. Resolved: Issue has been cleaned up with verification photos.',
    },
    {
      category: 'Report Management',
      question: 'How do I prioritize urgent reports?',
      answer: 'Reports are tagged with severity levels (Low, Medium, High, Critical). You can filter by severity in the Reports tab and prioritize high-severity reports for immediate assignment.',
    },
    {
      category: 'Worker Management',
      question: 'How do I add a new worker?',
      answer: 'Go to Workers tab and tap the "Add Worker" button. Fill in the worker\'s name, phone number, email, and employee ID. The worker will receive login credentials to access their mobile app.',
    },
    {
      category: 'Worker Management',
      question: 'Can I track worker locations?',
      answer: 'Yes, the map view shows real-time locations of active workers. This helps you assign reports to nearby workers for faster response times. Worker location is only tracked during work hours.',
    },
    {
      category: 'Worker Management',
      question: 'How do I reassign a task to a different worker?',
      answer: 'Open the report details, tap "Assign Worker", and select a different worker from the list. The previous worker will be notified that the task has been reassigned.',
    },
    {
      category: 'Worker Management',
      question: 'Can I view worker performance metrics?',
      answer: 'Yes, go to the Workers tab to see each worker\'s profile with stats including total tasks completed, average resolution time, and current active tasks.',
    },
    {
      category: 'Dashboard & Analytics',
      question: 'What does the dashboard show?',
      answer: 'The home dashboard displays key metrics including total reports, pending reports, active workers, and resolution rates. You can also see recent activity and quick access to critical tasks.',
    },
    {
      category: 'Dashboard & Analytics',
      question: 'How do I view reports on a map?',
      answer: 'Tap the map icon on the home screen or go to Map View to see all reports and worker locations plotted on an interactive map. You can filter by status and severity.',
    },
    {
      category: 'Dashboard & Analytics',
      question: 'Can I export reports for analysis?',
      answer: 'Currently, you can view all historical data within the app. Export functionality for reports and analytics is coming in a future update.',
    },
    {
      category: 'Account',
      question: 'How do I update my organization profile?',
      answer: 'Go to Profile > Edit Profile to update your NGO name, contact information, service categories, and operational areas. Make sure to save changes before exiting.',
    },
    {
      category: 'Account',
      question: 'Can I add multiple administrators?',
      answer: 'Currently, each NGO account has one primary administrator. Multi-admin support with role-based permissions is planned for future releases.',
    },
    {
      category: 'Technical',
      question: 'Why aren\'t real-time updates showing?',
      answer: 'Make sure you have a stable internet connection. The app syncs data in real-time when connected. If issues persist, try logging out and logging back in.',
    },
    {
      category: 'Technical',
      question: 'The map isn\'t loading. What should I do?',
      answer: 'Ensure you have granted location permissions to the app. Also check your internet connection as maps require data. If the issue continues, try restarting the app.',
    },
    {
      category: 'General',
      question: 'Is there a cost to use the admin portal?',
      answer: 'The platform is free for registered municipal organizations and NGOs. Our goal is to make waste management more efficient and accessible for all civic partners.',
    },
    {
      category: 'General',
      question: 'How do I contact support?',
      answer: 'Go to Profile > Contact Support to submit a ticket. Our support team typically responds within 24 hours. For urgent issues, use the priority support option.',
    },
  ];

  const categories = ['Getting Started', 'Report Management', 'Worker Management', 'Dashboard & Analytics', 'Account', 'Technical', 'General'];

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return 'rocket-outline';
      case 'Report Management':
        return 'document-text-outline';
      case 'Worker Management':
        return 'people-outline';
      case 'Dashboard & Analytics':
        return 'stats-chart-outline';
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
            Find answers to common questions about managing the Swachhsathi admin portal. If you need further assistance, contact our support team.
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
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push('../contact-support')}
          >
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
