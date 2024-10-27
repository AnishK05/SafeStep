import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections } from '../../utils/directionsService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RouteScreenRouteProp } from '../../navigation/navigationTypes'; // Import types

type Coordinates = {
  latitude: number;
  longitude: number;
};

// Define navigation type for RouteScreen
type RouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Route'>;

const RouteScreen = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>(); // Typed navigation
  const route = useRoute<RouteScreenRouteProp>(); // Typed route
  const { currentLocation, destination } = route.params;
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>([]);

  useEffect(() => {
    if (destination) {
      getDirections(currentLocation, destination).then(route => {
        const coords = route.legs[0].steps.map((step: any) => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));
        setRouteCoords(coords);
      }).catch(error => {
        console.error('Error fetching directions:', error);
      });
    }
  }, [destination, currentLocation]);

  const handleStartNavigation = () => {
    navigation.navigate('StartNavigation', { currentLocation, destination });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={currentLocation} />
        {destination && <Marker coordinate={destination} />}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={8} strokeColor='blue' />}
      </MapView>
      <Button title="Start Navigation" onPress={handleStartNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  map: {
    flex: 1,
  },
});

export default RouteScreen;
