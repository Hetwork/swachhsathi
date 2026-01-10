import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useAuthUser } from '@/firebase/hooks/useAuth';
import { useNGO, useUpdateNGO } from '@/firebase/hooks/useNGO';
import { useUpdateUser, useUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const garbageCategories = [
  'Dead Animals',
  'Garbage Collection',
  'Clean Public Space',
  'Overflowing Dustbins',
  'Construction Waste',
  'Plastic Waste',
  'Organic Waste',
  'Drain Cleaning',
];

const EditProfile = () => {
  const { data: authUser } = useAuthUser();
  const { data: userData, isLoading: userLoading } = useUser(authUser?.uid);
  const { data: ngoData, isLoading: ngoLoading } = useNGO(userData?.ngoId);
  const updateUser = useUpdateUser();
  const updateNGO = useUpdateNGO();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    ngoName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    registrationNumber: '',
  });

  useEffect(() => {
    if (userData && ngoData) {
      setFormData({
        ngoName: ngoData.ngoName || '',
        contactPerson: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: ngoData.address || '',
        city: ngoData.city || '',
        registrationNumber: ngoData.registrationNumber || '',
      });
      setSelectedCategories(ngoData.categories || []);
    }
  }, [userData, ngoData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSave = async () => {
    if (!formData.ngoName || !formData.contactPerson || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.registrationNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      // Update user data
      await updateUser.mutateAsync({
        uid: authUser!.uid,
        userData: {
          name: formData.contactPerson,
          phone: formData.phone,
        }
      });

      // Update NGO data
      await updateNGO.mutateAsync({
        ngoId: userData!.ngoId!,
        ngoData: {
          ngoName: formData.ngoName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          registrationNumber: formData.registrationNumber,
          categories: selectedCategories,
        }
      });

      Alert.alert(
        'Success', 
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    }
  };

  if (userLoading || ngoLoading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NGO Information</Text>
            
            <AppTextInput
              placeholder='NGO Name'
              autoCapitalize='words'
              value={formData.ngoName}
              onChangeText={(value) => handleInputChange('ngoName', value)}
            />

            <AppTextInput
              placeholder='Contact Person Name'
              autoCapitalize='words'
              value={formData.contactPerson}
              onChangeText={(value) => handleInputChange('contactPerson', value)}
            />

            <AppTextInput
              placeholder='Email Address'
              keyboardType='email-address'
              autoCapitalize='none'
              value={formData.email}
              editable={false}
              style={styles.disabledInput}
            />

            <AppTextInput
              placeholder='Phone Number'
              keyboardType='phone-pad'
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />

            <AppTextInput
              placeholder='Registration Number'
              value={formData.registrationNumber}
              onChangeText={(value) => handleInputChange('registrationNumber', value)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <AppTextInput
              placeholder='Office Address'
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />

            <AppTextInput
              placeholder='City'
              autoCapitalize='words'
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Categories</Text>
            <Text style={styles.sectionSubtitle}>Select the types of waste your NGO handles</Text>
            
            <View style={styles.categoriesGrid}>
              {garbageCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category) && styles.categoryChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Email address cannot be changed. Contact support if you need to update your email.
            </Text>
          </View>

          <AppButton 
            title={updateUser.isPending || updateNGO.isPending ? 'Saving...' : 'Save Changes'}
            style={styles.saveButton}
            onPress={handleSave}
            disabled={updateUser.isPending || updateNGO.isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background || '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight || '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },
  saveButton: {
    marginBottom: 20,
  },
});

export default EditProfile;
