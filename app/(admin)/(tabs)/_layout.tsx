import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react'

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
        <Tabs.Screen 
          name="home" 
          options={{
            headerShown: false, 
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="reports" 
          options={{
            headerShown: false, 
            title: 'Reports',
            tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="workers" 
          options={{
            headerShown: false, 
            title: 'Workers',
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            headerShown: false, 
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
          }}
        />
    </Tabs>
  )
}

export default _layout