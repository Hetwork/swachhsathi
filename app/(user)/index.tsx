import { Redirect } from 'expo-router'
import React from 'react'

const index = () => {
  return <Redirect href="/(user)/(tabs)/home" />
}

export default index