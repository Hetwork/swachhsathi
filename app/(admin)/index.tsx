import { Redirect } from 'expo-router'
import React from 'react'

const index = () => {
  return <Redirect href="/(admin)/(tabs)/home" />
}

export default index