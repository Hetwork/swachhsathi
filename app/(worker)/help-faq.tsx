import Container from '@/component/Container';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const HelpFAQ = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I log in to the app?',
      answer: 'Your admin will create your account and provide login credentials. Use your email and password to log in. If you forget your password, contact your administrator for a reset.',
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I enable location services?',
      answer: 'Go to your phone Settings > Apps > Swachhsathi > Permissions > Location, and select "Allow all the time" or "Allow only while using the app" for the app to work properly.',
    },
    {
      id: 3,
      category: 'Tasks',
      question: 'How do I accept a new task?',
      answer: 'When a task is assigned to you, you\'ll receive a notification. Open the app, go to the Tasks tab, and tap on the task to view details. The task is automatically accepted when assigned.',
    },
    {
      id: 4,
      category: 'Tasks',
      question: 'What if I can\'t find the location?',
      answer: 'Use the built-in map to navigate to the task location. If you still can\'t find it, tap the "Directions" button to open in Google Maps. Contact your admin if the location is incorrect.',
    },
    {
      id: 5,
      category: 'Tasks',
      question: 'How do I mark a task as complete?',
      answer: 'After completing the cleanup: 1) Take a photo of the clean area, 2) Open the task details, 3) Tap "Upload After Photo", 4) Tap "Mark as Complete". Make sure you\'re at the location.',
    },
    {
      id: 6,
      category: 'Tasks',
      question: 'What if I can\'t complete a task?',
      answer: 'If a task is too large, requires special equipment, or has hazardous materials, contact your admin immediately through the task details or support section. Don\'t attempt unsafe work.',
    },
    {
      id: 7,
      category: 'Tasks',
      question: 'Can I view my completed tasks?',
      answer: 'Yes! Go to the Tasks tab and filter by "Completed" status to see all your finished work and verify completion dates.',
    },
    {
      id: 8,
      category: 'Photos',
      question: 'Why do I need to upload photos?',
      answer: 'Photos verify that cleanup work was completed. Citizens and admins can see the before and after to confirm the issue was resolved. It also protects you by documenting your work.',
    },
    {
      id: 9,
      category: 'Photos',
      question: 'What makes a good verification photo?',
      answer: 'Take clear photos in good lighting showing the entire area. Capture the same angle before and after. Make sure the location is recognizable and the cleanup is clearly visible.',
    },
    {
      id: 10,
      category: 'Performance',
      question: 'How is my performance measured?',
      answer: 'Your performance is based on: number of tasks completed, average completion time, photo quality, and citizen feedback. You can view your stats in the Profile tab.',
    },
    {
      id: 11,
      category: 'Performance',
      question: 'Where can I see my work statistics?',
      answer: 'Go to the Profile tab to see your total tasks, completed tasks, active tasks, and success rate. Your admin can also provide detailed performance reports.',
    },
    {
      id: 12,
      category: 'Account',
      question: 'How do I change my password?',
      answer: 'Currently, password changes must be done through your administrator. Contact them via the support section if you need to update your credentials.',
    },
    {
      id: 13,
      category: 'Account',
      question: 'Can I edit my profile information?',
      answer: 'You can view your profile in the Profile tab. To update your name, phone number, or other details, contact your administrator.',
    },
    {
      id: 14,
      category: 'Technical',
      question: 'What if the app crashes or freezes?',
      answer: 'Try closing and reopening the app. If problems persist, restart your phone. Make sure you have the latest app version. Contact support if issues continue.',
    },
    {
      id: 15,
      category: 'Technical',
      question: 'Why aren\'t I receiving notifications?',
      answer: 'Check: 1) Phone Settings > Notifications > Swachhsathi is enabled, 2) You have internet connection, 3) You\'re logged in to the app. If still not working, contact support.',
    },
    {
      id: 16,
      category: 'Safety',
      question: 'What should I do if I encounter hazardous waste?',
      answer: 'DO NOT attempt to clean hazardous materials. Take a photo, mark the task as requiring special attention, and contact your admin immediately. Report what type of hazard you found.',
    },
    {
      id: 17,
      category: 'Safety',
      question: 'What safety equipment should I use?',
      answer: 'Always use provided safety equipment: gloves, reflective vest, appropriate footwear, and masks when needed. Follow your organization\'s safety protocols.',
    },
  ];

  const categories = ['Getting Started', 'Tasks', 'Photos', 'Performance', 'Account', 'Technical', 'Safety'];

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Getting Started': 'rocket',
      'Tasks': 'clipboard',
      'Photos': 'camera',
      'Performance': 'stats-chart',
      'Account': 'person',
      'Technical': 'construct',
      'Safety': 'shield-checkmark',
    };
    return icons[category] || 'help-circle';
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
        <View style={styles.searchCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.searchText}>Find answers to common questions below</Text>
        </View>

        {categories.map((category) => {
          const categoryFAQs = faqs.filter(faq => faq.category === category);
          
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={getCategoryIcon(category)} size={20} color={colors.primary} />
                <Text style={styles.categoryTitle}>{category}</Text>
              </View>

              {categoryFAQs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.faqCard}
                  onPress={() => toggleExpand(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.questionRow}>
                    <Text style={styles.question}>{faq.question}</Text>
                    <Ionicons 
                      name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={colors.textSecondary}
                    />
                  </View>
                  
                  {expandedId === faq.id && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answer}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <View style={styles.contactCard}>
          <Ionicons name="chatbubble-ellipses" size={32} color={colors.primary} />
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactText}>
            Can't find the answer you're looking for? Our support team is here to help.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push('./contact-support')}
          >
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
  searchCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight || '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 12,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#F3F4F6',
  },
  answer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: colors.white,
    margin: 16,
    padding: 24,
    borderRadius: 12,
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
    marginBottom: 16,
    lineHeight: 22,
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});

export default HelpFAQ;
