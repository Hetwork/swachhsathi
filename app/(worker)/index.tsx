import { Redirect } from 'expo-router'
import React from 'react'

const index = () => {
  return <Redirect href="/(worker)/(tabs)/home" />
}

export default index