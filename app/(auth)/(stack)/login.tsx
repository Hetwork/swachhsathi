import AppButton from '@/component/AppButton';
import AppTextInput from '@/component/AppTextInput';
import Container from '@/component/Container';
import { useSignIn } from '@/firebase/hooks/useAuth';
import UserService from '@/firebase/services/UserService';
import { colors } from '@/utils/colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await signIn.mutateAsync({ email, password });
      const userData = await UserService.getUser(userCredential.user.uid);
      
      if (userData?.role === 'admin') {
        router.replace('/(admin)/(tabs)/home');
      } else if (userData?.role === 'worker') {
        router.replace('/(worker)/(tabs)/home');
      } else {
        router.replace('/(user)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  return (
    <Container>
      <View style={styles.root}>
        <Image source={require('../../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>SwachhSathi Login</Text>
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
        <AppButton 
          title={signIn.isPending ? 'Logging in...' : 'Login'} 
          style={{ marginTop: 20 }} 
          onPress={handleLogin}
          disabled={signIn.isPending}
        />
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
            <Text style={styles.signupLink} onPress={() => router.push('/(auth)/(stack)/signup')}>Sign Up</Text>
        </View>
      </View>
    </Container>
  )
}

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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.textPrimary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginRight: 6,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Login