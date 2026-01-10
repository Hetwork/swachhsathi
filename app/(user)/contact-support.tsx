import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useCreateTicket } from '@/firebase/hooks/useSupport';
import { useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type CategoryType = 'technical' | 'account' | 'report' | 'general' | 'feedback';

interface Category {
  id: CategoryType;
  label: string;
  icon: string;
  description: string;
}

const ContactSupport = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData, isLoading: userLoading } = useUser(authUser?.uid);
  const createTicket = useCreateTicket();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const categories: Category[] = [
    {
      id: 'technical',
      label: 'Technical Issue',
      icon: 'settings-outline',
      description: 'App crashes, bugs, or errors',
    },
    {
      id: 'account',
      label: 'Account Help',
      icon: 'person-outline',
      description: 'Login, profile, or password issues',
    },
    {
      id: 'report',
      label: 'Report Issue',
      icon: 'document-text-outline',
      description: 'Problems with your reports',
    },
    {
      id: 'general',
      label: 'General Inquiry',
      icon: 'help-circle-outline',
      description: 'Questions about the app',
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'chatbubble-outline',
      description: 'Suggestions or improvements',
    },
  ];

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    if (!authUser || !userData) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    try {
      await createTicket.mutateAsync({
        userId: authUser.uid,
        userName: userData.name || 'User',
        userEmail: userData.email || authUser.email || '',
        subject: subject.trim(),
        message: message.trim(),
        category: selectedCategory,
      });

      Alert.alert(
        'Success',
        'Your support ticket has been submitted. We\'ll get back to you soon!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit support ticket');
    }
  };

  if (userLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <Ionicons name="mail" size={40} color={colors.primary} />
            <Text style={styles.infoTitle}>We're here to help!</Text>
            <Text style={styles.infoText}>
              Having an issue or question? Send us a message and our support team will get back to you within 24 hours.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={selectedCategory === category.id ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.categoryLabelActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subject</Text>
            <AppTextInput
              placeholder="Brief description of your issue"
              value={subject}
              onChangeText={setSubject}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Please describe your issue or question in detail..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="person" size={18} color={colors.textSecondary} />
              <Text style={styles.contactText}>{userData?.name || 'User'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={18} color={colors.textSecondary} />
              <Text style={styles.contactText}>{userData?.email || authUser?.email}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <AppButton
              title={createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
              onPress={handleSubmit}
              disabled={createTicket.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  infoCard: {
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
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border || '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight || '#E3F2FD',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.primary,
  },
  categoryDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 120,
  },
  contactInfo: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});

export default ContactSupport;
