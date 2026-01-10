import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useUser } from '@/firebase/hooks/useUser';
import { UserService } from '@/firebase/services/UserService';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EditProfile = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData } = useUser(authUser?.uid);
  
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await UserService.updateUser(authUser?.uid || '', {
        name: name.trim(),
        phone: phone.trim(),
      });

      Alert.alert(
        'Success',
        'Your profile has been updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
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
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name?.charAt(0).toUpperCase() || userData?.name?.charAt(0).toUpperCase() || 'W'}
                </Text>
              </View>
              <View style={styles.workerBadge}>
                <Ionicons name="construct" size={20} color="#3B82F6" />
              </View>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Field Worker</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                Update your personal information below
              </Text>
            </View>

            <Text style={styles.label}>Full Name *</Text>
            <AppTextInput
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
            />

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.disabledInput}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.disabledText}>{userData?.email || 'N/A'}</Text>
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>

            <Text style={styles.label}>Phone Number</Text>
            <AppTextInput
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              leftIcon="call-outline"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Role</Text>
            <View style={styles.disabledInput}>
              <Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.disabledText}>{userData?.role || 'worker'}</Text>
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.helperText}>Role is assigned by your administrator</Text>

            <AppButton
              title={loading ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={loading}
            />

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              <Text style={styles.securityTitle}>Account Security</Text>
            </View>
            <Text style={styles.securityText}>
              To change your password or update security settings, please contact your administrator.
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => router.push('../contact-support')}
            >
              <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
              <Text style={styles.contactButtonText}>Contact Admin</Text>
            </TouchableOpacity>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  workerBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight || '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  disabledInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background || '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  disabledText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
  },
  lockBadge: {
    backgroundColor: colors.background || '#F3F4F6',
    padding: 4,
    borderRadius: 6,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginLeft: 4,
  },
  cancelButton: {
    backgroundColor: colors.background || '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  securityCard: {
    backgroundColor: colors.primaryLight || '#E3F2FD',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default EditProfile;
