import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
   <Stack  screenOptions={{headerShown:false}}>
    <Stack.Screen name="intro" />
    <Stack.Screen name="login" />
    <Stack.Screen name="signup" />
    <Stack.Screen name="ngoregister" />
    </Stack>
  )
}

export default _layout