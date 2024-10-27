import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections } from '../../utils/directionsService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RouteScreenRouteProp } from '../../navigation/navigationTypes'; // Import types
import { Ionicons } from '@expo/vector-icons';

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

      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* RouteScreen Content */}
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
        <Marker coordinate={currentLocation} />
        {destination && <Marker coordinate={destination} />}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={8} strokeColor='blue' />}
      </MapView>

      {/* Custom Styled Button */}
      <TouchableOpacity style={styles.startNavigationButton} onPress={handleStartNavigation}>
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
    borderRadius: 50, // Rounded button
    width: 40, // Adjust width to make it square
    height: 40, // Adjust height to make it square
    margin: 10, // Space around the button
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
    backgroundColor: '#2a4a8b', // Custom background color
    paddingVertical: 15,
    paddingTop: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50, 
  },
  startNavigationButtonText: {
    color: '#fff', // White text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RouteScreen;
