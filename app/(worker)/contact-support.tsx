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
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ContactSupport = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  const createTicket = useCreateTicket();
  
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const categories = [
    { id: 'technical', label: 'Technical Issue', icon: 'construct' },
    { id: 'task', label: 'Task Issue', icon: 'clipboard' },
    { id: 'location', label: 'Location Problem', icon: 'navigate' },
    { id: 'safety', label: 'Safety Concern', icon: 'shield-checkmark' },
    { id: 'general', label: 'General Inquiry', icon: 'chatbubble' },
    { id: 'feedback', label: 'Feedback', icon: 'star' },
  ];

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert('Required', 'Please select a category');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Required', 'Please enter a subject');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Required', 'Please describe your issue');
      return;
    }

    try {
      await createTicket.mutateAsync({
        userId: authUser?.uid || '',
        userName: userData?.name || 'Worker',
        userEmail: userData?.email || '',
        userRole: 'worker',
        category,
        subject: subject.trim(),
        message: message.trim(),
      });

      Alert.alert(
        'Support Ticket Created',
        'Your support request has been submitted. An administrator will respond soon.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );

      setCategory('');
      setSubject('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support ticket. Please try again.');
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <View style={styles.workerBadge}>
              <Ionicons name="construct" size={20} color={colors.white} />
              <Text style={styles.badgeText}>Field Worker</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{userData?.name || 'Worker'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{userData?.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categoryCardSelected,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={24}
                    color={category === cat.id ? colors.white : colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.id && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Subject</Text>
            <AppTextInput
              placeholder="Brief description of your issue"
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.sectionTitle}>Message</Text>
            <AppTextInput
              placeholder="Describe your issue in detail..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              style={styles.messageInput}
            />

            <AppButton
              title={createTicket.isPending ? 'Submitting...' : 'Submit Request'}
              onPress={handleSubmit}
              disabled={createTicket.isPending}
            />
          </View>

          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            </View>
            <Text style={styles.emergencyText}>
              For urgent safety issues or emergencies, contact your supervisor directly:
            </Text>
            <View style={styles.emergencyContact}>
              <Ionicons name="call" size={20} color="#EF4444" />
              <Text style={styles.emergencyPhone}>Emergency Hotline: 1800-XXX-XXXX</Text>
            </View>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for Better Support</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Be specific about the issue you're facing
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Include task IDs or location details if relevant
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Mention steps you've already tried to resolve it
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Check your notifications for responses from admin
              </Text>
            </View>
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
  keyboardView: {
    flex: 1,
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
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workerBadge: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.background || '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: colors.white,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  emergencyCard: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  emergencyText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyPhone: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  tipsCard: {
    backgroundColor: colors.primaryLight || '#E3F2FD',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default ContactSupport;
