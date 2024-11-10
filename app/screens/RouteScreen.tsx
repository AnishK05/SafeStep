import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { Ionicons } from '@expo/vector-icons';
import { getDirections } from '../../utils/directionsService';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type RouteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Route'>;

const RouteScreen = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();
  const route = useRoute();
  const { currentLocation, destination } = route.params as {
    currentLocation: Coordinates;
    destination: Coordinates;
  };

  const [routes, setRoutes] = useState<Coordinates[][]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]); // New state to hold full route data
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (destination) {
      getDirections(currentLocation, destination)
        .then((routesData) => {
          if (Array.isArray(routesData)) {
            const allRoutes = routesData.map(route =>
              route.legs[0].steps.map((step: any) => ({
                latitude: step.end_location.lat,
                longitude: step.end_location.lng,
              }))
            );
            setRoutes(allRoutes);
            setRoutesData(routesData); // Store full route data for later use
          } else {
            Alert.alert('Error', 'Unexpected data structure from directions service.');
          }
        })
        .catch((error) => {
          console.error('Error fetching directions:', error);
          Alert.alert('Error', 'Failed to fetch directions. Please try again.');
        });
    }
  }, [destination, currentLocation]);

  const handleRouteSelect = (index: number) => {
    setSelectedRouteIndex(index);
  };

  const handleStartNavigation = () => {
    if (selectedRouteIndex !== null) {
      navigation.navigate('StartNavigation', {
        currentLocation,
        destination,
        selectedRoute: routes[selectedRouteIndex],
        selectedRouteLegs: routesData[selectedRouteIndex], // Pass full route data
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Route Preview</Text>

      <MapView
        style={styles.map}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={currentLocation} title="Current Location" />
        {destination && <Marker coordinate={destination} title="Destination" />}

        {routes.length > 0 &&
          routes.map((routeCoords, index) => (
            <Polyline
              key={`route-${index}`}
              coordinates={routeCoords}
              strokeWidth={6}
              strokeColor={selectedRouteIndex === index ? 'blue' : 'gray'}
              tappable
              onPress={() => handleRouteSelect(index)}
            />
          ))}
      </MapView>

      <TouchableOpacity
        style={[
          styles.startNavigationButton,
          selectedRouteIndex === null && styles.disabledButton
        ]}
        onPress={handleStartNavigation}
        disabled={selectedRouteIndex === null}
      >
        <Text style={styles.startNavigationButtonText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  screenTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  startNavigationButton: {
    backgroundColor: '#2a4a8b',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  startNavigationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RouteScreen;
