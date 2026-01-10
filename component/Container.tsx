import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container: React.FC<{children: React.ReactNode, top?: number  , bottom?: number}> = ( { children  , top , bottom }) => {
    const insets = useSafeAreaInsets();
  return (
    <View style={{flex:1, paddingTop:top ?? insets.top, paddingBottom:bottom ?? insets.bottom}}>
      {children}
    </View>
  );
}

export default Container