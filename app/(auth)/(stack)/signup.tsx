import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useSignUp } from '@/firebase/hooks/useAuth';
import { useCreateUser } from '@/firebase/hooks/useUser';
import { colors } from '@/utils/colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signUp = useSignUp();
  const createUser = useCreateUser();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await signUp.mutateAsync({ email, password });
      await createUser.mutateAsync({
        uid: userCredential.user.uid,
        userData: { email, name, role: 'user' }
      });
      router.replace('/(user)/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account');
    }
  };

  return (
    <Container>
      <View style={styles.root}>
        <Image source={require('../../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <AppTextInput
          placeholder='Name'
          autoCapitalize='words'
          value={name}
          onChangeText={setName}
        />
        <AppTextInput
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
          onChangeText={setEmail}
        />
        <AppTextInput
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <AppTextInput
          placeholder='Confirm Password'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <AppButton 
          title='Sign Up' 
          style={{ marginTop: 20 }} 
          onPress={handleSignUp}
          disabled={signUp.isPending || createUser.isPending}
        />
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Text style={styles.loginLink} onPress={() => router.push('/(auth)/(stack)/login')}>Login</Text>
        </View>
      </View>
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
});

export default Signup;