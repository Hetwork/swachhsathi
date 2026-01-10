import { colors } from '@/utils/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  title = 'Location',
  description,
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          description={description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background || '#F3F4F6',
  },
  map: {
    flex: 1,
  },
});

export default LocationMap;
