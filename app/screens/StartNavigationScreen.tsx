import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections } from '../../utils/directionsService';
import { useRoute } from '@react-navigation/native';
import { LocationObject, watchPositionAsync, Accuracy } from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import * as Speech from 'expo-speech';
import { debounce } from 'lodash';
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
    longitudeDelta: 0.01
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

  // Manual camera re-centering function
  const recenterCamera = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: userLocation,
          pitch: 45, // Optional 3D pitch
          heading: 0, // Face North
          zoom: 17,
        },
        { duration: 500 }
      );
    }
  };

  const speakDirection = (stepIndex: number) => {
    if (voiceEnabled && directions[stepIndex]) {
      try {
        const cleanText = stripHtmlTags(directions[stepIndex]);
        Speech.speak(cleanText, {
          language: 'en-US',
          pitch: 1.0,
          rate: 1.0
        });
      } catch (error) {
        console.error('Error with speech:', error);
      }
    }
  };

  // Function to check if the user is close enough to the next step
  const checkProximityToStep = (location: Coordinates) => {
    let closestStep = currentStep;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let userOnCorrectPath = false;

    // Iterate through route segments to find the closest
    for (let i = currentStep; i < routeCoords.length - 1; i++) {
      const segmentStart = routeCoords[i];
      const segmentEnd = routeCoords[i + 1];
      
      // Calculate the perpendicular distance from the user to the route segment
      const distanceToSegment = calculateDistanceToSegment(location, segmentStart, segmentEnd);

      if (distanceToSegment < minDistance) {
        minDistance = distanceToSegment;
        closestStep = i;
        
        // Check if the user is heading in the correct direction along this segment
        if (isHeadingCorrect(location, segmentStart, segmentEnd)) {
          userOnCorrectPath = true;
        }
      }
    }

    // If the user is close enough to the closest segment and heading correctly, update the step
    if (minDistance < 20 || userOnCorrectPath) {
      setCurrentStep(closestStep + 1);
      speakDirection(closestStep + 1);
    }
  };

  // Helper function to calculate the perpendicular distance to a segment
  const calculateDistanceToSegment = (location: Coordinates, start: Coordinates, end: Coordinates): number => {
    const x0 = location.latitude;
    const y0 = location.longitude;
    const x1 = start.latitude;
    const y1 = start.longitude;
    const x2 = end.latitude;
    const y2 = end.longitude;

    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

    return numerator / denominator;
  };

  // Helper function to check if the user is heading in the correct direction
  const isHeadingCorrect = (location: Coordinates, segmentStart: Coordinates, segmentEnd: Coordinates): boolean => {
    const desiredHeading = calculateBearing(segmentStart, segmentEnd);
    const currentHeading = calculateBearing(location, segmentEnd);
    
    // Check if the current heading is within a tolerance range of the desired heading
    const tolerance = 20; // Degrees tolerance
    return Math.abs(desiredHeading - currentHeading) <= tolerance;
  };

  // Helper function to calculate the bearing between two points
  const calculateBearing = (start: Coordinates, end: Coordinates): number => {
    const lat1 = start.latitude * (Math.PI / 180);
    const lat2 = end.latitude * (Math.PI / 180);
    const deltaLong = (end.longitude - start.longitude) * (Math.PI / 180);

    const y = Math.sin(deltaLong) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLong);

    return (Math.atan2(y, x) * 180) / Math.PI;
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
        Speech.speak(steps[0]);
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
        followsUserLocation={false} // Disable auto-following
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

      {/* Recenter Button */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={recenterCamera}
      >
        <Ionicons
          name="navigate-outline" // Use the navigate icon for re-centering
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

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
  recenterButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: '#2a4a8b',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  recenterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FirstPersonNavigationScreen;
