import { Redirect } from 'expo-router'
import React from 'react'

const index = () => {
  return <Redirect href="/(auth)/(stack)/intro" />
}

export default index