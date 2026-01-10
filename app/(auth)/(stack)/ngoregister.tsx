import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useSignUp } from '@/firebase/hooks/useAuth';
import { useCreateNGO } from '@/firebase/hooks/useNGO';
import { useCreateUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
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

const NgoRegister = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    ngoName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
  });

  const signUp = useSignUp();
  const createUser = useCreateUser();
  const createNGO = useCreateNGO();

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

  const handleRegister = async () => {
    if (!formData.ngoName || !formData.contactPerson || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.registrationNumber || 
        !formData.password || !formData.confirmPassword) {
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

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await signUp.mutateAsync({ 
        email: formData.email, 
        password: formData.password 
      });

      const uid = userCredential.user.uid;

      // Step 2: Create user document with 'admin' role
      await createUser.mutateAsync({
        uid,
        userData: { 
          email: formData.email, 
          name: formData.contactPerson,
          phone: formData.phone,
          role: 'admin',
          ngoId: uid,
        }
      });

      // Step 3: Create NGO document with all details
      await createNGO.mutateAsync({
        ngoId: uid,
        ngoData: {
          ngoName: formData.ngoName,
          adminId: uid,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          registrationNumber: formData.registrationNumber,
          categories: selectedCategories,
        }
      });

      // Wait a moment to ensure documents are fully created
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to admin dashboard
      router.replace('/(admin)/(tabs)/home');
    } catch (error: any) {
      console.error('NGO Registration error:', error);
      Alert.alert('Error', error.message || 'Failed to register NGO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.root}>
            <Image source={require('../../../assets/images/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Register NGO</Text>

            <AppTextInput
              placeholder='NGO Name'
              autoCapitalize='words'
              value={formData.ngoName}
              onChangeText={(value) => handleInputChange('ngoName', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Contact Person Name'
              autoCapitalize='words'
              value={formData.contactPerson}
              onChangeText={(value) => handleInputChange('contactPerson', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Email Address'
              keyboardType='email-address'
              autoCapitalize='none'
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Phone Number'
              keyboardType='phone-pad'
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Office Address'
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='City'
              autoCapitalize='words'
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Registration Number'
              value={formData.registrationNumber}
              onChangeText={(value) => handleInputChange('registrationNumber', value)}
              editable={!loading}
            />

            {/* Categories Multi-Select */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesLabel}>Select Categories *</Text>
              <View style={styles.categoriesGrid}>
                {garbageCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category) && styles.categoryChipSelected,
                    ]}
                    onPress={() => toggleCategory(category)}
                    disabled={loading}
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

            <AppTextInput
              placeholder='Password'
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              editable={!loading}
            />

            <AppTextInput
              placeholder='Confirm Password'
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              editable={!loading}
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ Your organization will be verified by the municipal administration before activation.
              </Text>
            </View>

            <AppButton 
              title={loading ? 'Registering...' : 'Register NGO'}
              style={{ marginTop: 20 }} 
              onPress={handleRegister}
              disabled={loading || signUp.isPending || createUser.isPending || createNGO.isPending}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Text style={styles.loginLink} onPress={() => !loading && router.push('/(auth)/(stack)/login')}>
                Login
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginRight: 6,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  categoriesContainer: {
    marginVertical: 8,
  },
  categoriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 4,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  categoryChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default NgoRegister;
