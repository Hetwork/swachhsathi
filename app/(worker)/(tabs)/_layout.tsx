import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
        <Tabs.Screen name="profile" options={{ title: 'profile' }} />
    </Tabs>
  )
}

export default _layout