import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections } from '../../utils/directionsService';
import { useRoute } from '@react-navigation/native';
import { LocationObject, watchPositionAsync, Accuracy } from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import * as Speech from 'expo-speech';
import { throttle, debounce } from 'lodash';
import { Ionicons } from '@expo/vector-icons'; // Import icons for the toggle button

type Coordinates = {
  latitude: number;
  longitude: number;
};

const screenWidth = Dimensions.get('window').width;

const FirstPersonNavigationScreen = () => {
  const route = useRoute();
  const { currentLocation, destination } = route.params as {
    currentLocation: Coordinates;
    destination: Coordinates;
  };

  const [userLocation, setUserLocation] = useState<Coordinates>(currentLocation);
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>([]);
  const [directions, setDirections] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [heading, setHeading] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const mapRef = useRef<MapView | null>(null);
  const lastKnownLocation = useRef<Coordinates>(currentLocation);
  const locationSubscriptionRef = useRef<any>(null);
  const magnetometerSubscriptionRef = useRef<any>(null);

  const initialRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Helper function to remove HTML tags
  const stripHtmlTags = (text: string): string => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); // Removes any HTML tags
  };

  // Calculate distance between two coordinates
  const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const updateCamera = useCallback(
    throttle((newLocation: Coordinates, heading: number) => {
      if (mapRef.current) {
        mapRef.current.animateCamera(
          {
            center: newLocation,
            pitch: 45, // 3D pitch view
            heading: heading, // Keep the camera aligned with device heading
            zoom: 17, // Closer zoom for 3D effect
          },
          { duration: 300 }
        );
      }
    }, 2000), // Throttle updates to trigger once every 2 seconds
    []
  );

  const speakDirection = async (stepIndex: number) => {
    if (voiceEnabled && directions[stepIndex]) {
      try {
        const cleanText = stripHtmlTags(directions[stepIndex]);
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
          Speech.stop(); // Stop any ongoing speech
        }
        Speech.speak(cleanText, {
          language: 'en',
          pitch: 1.0,
          rate: 1.0,
        });
      } catch (error) {
        console.error('Error with speech:', error);
      }
    }
  };

  // Function to check if the user is close enough to the next step
  const checkProximityToStep = (location: Coordinates) => {
    if (currentStep < routeCoords.length) {
      const nextStep = routeCoords[currentStep];
      const distanceToNextStep = calculateDistance(location, nextStep);

      // If the user is within 20 meters of the next step, advance to the next step
      if (distanceToNextStep < 20) {
        setCurrentStep((prevStep) => prevStep + 1);
        speakDirection(currentStep);
      }
    }
  };

  useEffect(() => {
    const startLocationUpdates = async () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }

      locationSubscriptionRef.current = await watchPositionAsync(
        { accuracy: Accuracy.BestForNavigation, timeInterval: 15000, distanceInterval: 20 },
        async (location: LocationObject) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          if (calculateDistance(lastKnownLocation.current, newLocation) > 5) {
            setUserLocation(newLocation);
            lastKnownLocation.current = newLocation;
            updateCamera(newLocation, heading);

            // Check if user is near the next navigation step
            checkProximityToStep(newLocation);
          }
        }
      );
    };

    startLocationUpdates();

    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, [heading]);

  useEffect(() => {
    if (destination) {
      getDirections(currentLocation, destination).then(route => {
        const coords = route.legs[0].steps.map((step: any) => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));
        const steps = route.legs[0].steps.map((step: any) => stripHtmlTags(step.html_instructions));
        setRouteCoords(coords);
        setDirections(steps);
      }).catch(error => {
        console.error('Error fetching directions:', error);
      });
    }
  }, [destination, currentLocation]);

  useEffect(() => {
    if (magnetometerSubscriptionRef.current) {
      magnetometerSubscriptionRef.current.remove();
    }

    magnetometerSubscriptionRef.current = Magnetometer.addListener(
      debounce(({ x, y, z }) => {
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        const normalizedAngle = (angle >= 0 ? angle : 360 + angle);
        setHeading(normalizedAngle);
      }, 1000)
    );

    return () => {
      if (magnetometerSubscriptionRef.current) {
        magnetometerSubscriptionRef.current.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        pitchEnabled={true}
        rotateEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        showsBuildings={true}
        initialRegion={initialRegion}
      >
        {destination && <Marker coordinate={destination} />}

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={8}
            strokeColor="#0000FF"
          />
        )}
      </MapView>

      <View style={styles.directionsOverlay}>
        <Text style={styles.directionsText}>
          {directions[currentStep] || 'You have reached your destination!'}
        </Text>
      </View>

      {/* Voice Toggle Icon */}
      <TouchableOpacity
        style={styles.voiceToggleContainer}
        onPress={() => setVoiceEnabled(!voiceEnabled)}
      >
        <Ionicons
          name={voiceEnabled ? "volume-high-outline" : "volume-mute-outline"}
          size={24}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  directionsOverlay: {
    position: 'absolute',
    top: 10,
    width: screenWidth - 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  directionsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  voiceToggleContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 25,
  },
});

export default FirstPersonNavigationScreen;
