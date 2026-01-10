import AuthService from '@/firebase/services/AuthService';
import UserService from '@/firebase/services/UserService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/utils/colors';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = AuthService.onAuthStateChanged(async (authUser) => {
        if (authUser) {
          const userData = await UserService.getUser(authUser.uid);
          const userRole = userData?.role || 'user';

          if (userRole === 'admin') {
            router.replace('/(admin)/(tabs)/home');
          } else if (userRole === 'worker') {
            router.replace('/(worker)/(tabs)/home');
          } else {
            router.replace('/(user)/(tabs)/home');
          }
        } else {
          router.replace('/(auth)/(stack)/intro');
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default Index;