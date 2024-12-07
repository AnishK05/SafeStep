import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { LocationObject, watchPositionAsync, Accuracy } from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import * as Speech from 'expo-speech';
import { debounce } from 'lodash';
import { Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const screenWidth = Dimensions.get('window').width;

const FirstPersonNavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentLocation, destination, selectedRoute, selectedRouteLegs, totalDistance, estimatedTime } = route.params as {
    currentLocation: Coordinates;
    destination: Coordinates;
    selectedRoute: Coordinates[];
    selectedRouteLegs: any; 
    totalDistance: string;
    estimatedTime: string;
  };

  const [userLocation, setUserLocation] = useState<Coordinates>(currentLocation);
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>(selectedRoute);
  const [directions, setDirections] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [heading, setHeading] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const mapRef = useRef<MapView | null>(null);
  const lastKnownLocation = useRef<Coordinates>(currentLocation);
  const locationSubscriptionRef = useRef<any>(null);
  const magnetometerSubscriptionRef = useRef<any>(null);
  const { isDarkTheme } = useTheme(); // Access theme state

  const [remainingDistance, setRemainingDistance] = useState<string>(totalDistance);
  const [remainingTime, setRemainingTime] = useState<string>(estimatedTime);


  const initialRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  const handleActivityReport = (activity: string) => {
    Alert.alert("Report Submitted", `Activity reported: ${activity}`);
  };

  const stripHtmlTags = (text: string): string => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371e3;
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const recenterCamera = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: userLocation,
          pitch: 45,
          heading: 0,
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

  const checkProximityToStep = (location: Coordinates) => {
    let closestStep = currentStep;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let userOnCorrectPath = false;
    let distanceLeft = 0;

    for (let i = currentStep; i < routeCoords.length - 1; i++) {
      const segmentStart = routeCoords[i];
      const segmentEnd = routeCoords[i + 1];
      const distanceToSegment = calculateDistanceToSegment(location, segmentStart, segmentEnd);

      if (distanceToSegment < minDistance) {
        minDistance = distanceToSegment;
        closestStep = i;

        if (isHeadingCorrect(location, segmentStart, segmentEnd)) {
          userOnCorrectPath = true;
        }
      }

      // Sum remaining distances
      if (i >= currentStep) {
        distanceLeft += calculateDistance(segmentStart, segmentEnd);
      }
      
    }

    if (minDistance < 20 || userOnCorrectPath) {
      setCurrentStep(closestStep + 1);
      speakDirection(closestStep + 1);

       // Convert distance to miles and update state
      const remainingMiles = (distanceLeft / 1609.34).toFixed(2); // Convert meters to miles
      setRemainingDistance(`${remainingMiles} mi`);

      // Estimate remaining time based on a fixed average speed
      const averageSpeedMph = 3; // Example walking speed in miles per hour
      const remainingMinutes = Math.ceil((parseFloat(remainingMiles) / averageSpeedMph) * 60);
      setRemainingTime(`${remainingMinutes} min`);
    }
  };

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

  const isHeadingCorrect = (location: Coordinates, segmentStart: Coordinates, segmentEnd: Coordinates): boolean => {
    const desiredHeading = calculateBearing(segmentStart, segmentEnd);
    const currentHeading = calculateBearing(location, segmentEnd);

    const tolerance = 20;
    return Math.abs(desiredHeading - currentHeading) <= tolerance;
  };

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
    if (selectedRouteLegs && selectedRouteLegs.legs && selectedRouteLegs.legs.length > 0) {
      const coords = selectedRouteLegs.legs[0].steps.map((step: any) => ({
        latitude: step.end_location.lat,
        longitude: step.end_location.lng,
      }));
      const steps = selectedRouteLegs.legs[0].steps.map((step: any) => stripHtmlTags(step.html_instructions));
      setRouteCoords(coords);
      setDirections(steps);
      Speech.speak(steps[0]);
    }
  }, [selectedRouteLegs]);


  useEffect(() => {
    // Assume that the directions for the selected route have already been set
    // If needed, use the route's directions information (provided in RouteScreen)
    if (selectedRoute) {
      setRouteCoords(selectedRoute);
      // Handle step-based instructions if already available (if you pass them through route.params)
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (magnetometerSubscriptionRef.current) {
      magnetometerSubscriptionRef.current.remove();
    }

    magnetometerSubscriptionRef.current = Magnetometer.addListener(
      debounce(({ x, y }) => {
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        const normalizedAngle = angle >= 0 ? angle : 360 + angle;
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
    <View style={styles(isDarkTheme).container}>

      <MapView
        ref={mapRef}
        style={styles(isDarkTheme).map}
        showsUserLocation={true}
        followsUserLocation={false}
        pitchEnabled={true}
        rotateEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        showsBuildings={true}
        initialRegion={initialRegion}
      >
        {destination && <Marker coordinate={destination} />}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={8} strokeColor="#0000FF" />
        )}
      </MapView>

      <View style={styles(isDarkTheme).displayOverlay}>
        <View style={styles(isDarkTheme).routeInfo}>
          <Text style={styles(isDarkTheme).infoTimeText}>{remainingTime}</Text>
          <Text style={styles(isDarkTheme).infoDistanceText}>{remainingDistance}</Text>
        </View>
        <TouchableOpacity style={styles(isDarkTheme).exitButton} onPress={() => navigation.goBack()}>
          <Text style={styles(isDarkTheme).exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles(isDarkTheme).directionsOverlay}>
        <Text style={styles(isDarkTheme).directionsText}>
          {directions[currentStep] || 'You have reached your destination!'}
        </Text>
      </View>

      <TouchableOpacity style={styles(isDarkTheme).recenterButton} onPress={recenterCamera}>
        <Ionicons name="navigate-outline" size={24} color={isDarkTheme ? '#fff' : '#fff'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(isDarkTheme).voiceToggleContainer}
        onPress={() => setVoiceEnabled(!voiceEnabled)}
      >
        <Ionicons
          name={voiceEnabled ? "volume-high-outline" : "volume-mute-outline"}
          size={24}
          color={isDarkTheme ? '#fff' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(isDarkTheme).constructionButton}
        onPress={() => handleActivityReport("Construction")}
      >
        <FontAwesome6 name="road-barrier" size={22} color="orange" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(isDarkTheme).reportButton}
        onPress={() => handleActivityReport("Crime")}
      >
        <MaterialIcons name="security" size={24} color="red" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(isDarkTheme).lightButton}
        onPress={() => handleActivityReport("Lighting Issue")}
      >
        <Ionicons name="bulb-outline" size={24} color="yellow" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(isDarkTheme).peopleButton}
        onPress={() => handleActivityReport("Crowded Area")}
      >
        <Ionicons name="people" size={24} color="tan" />
      </TouchableOpacity>

    </View>
  );
};

const styles = (isDarkTheme: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  directionsOverlay: {
    position: 'absolute',
    top: 80,
    width: screenWidth - 40,
    alignSelf: 'center',
    backgroundColor: isDarkTheme ? '#1c2a48' : '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  directionsText: {
    color: isDarkTheme ? '#fff' : '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  displayOverlay: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth - 20,
    marginHorizontal: 10,
    backgroundColor: isDarkTheme ? '#1c1c1e' : '#ffffff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowColor: '#ffffff',
  },
  routeInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  infoTimeText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkTheme ? '#ffffff' : '#000000',
    marginVertical: 2,
  },
  infoDistanceText: {
    fontSize: 15,
    color: isDarkTheme ? '#ffffff' : '#000000',
    marginVertical: 2,
  },
  exitButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  voiceToggleContainer: {
    position: 'absolute',
    top: 270,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
  recenterButton: {
    position: 'absolute',
    top: 200,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
  constructionButton: {
    position: 'absolute',
    top: 340,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
  reportButton: {
    position: 'absolute',
    top: 410,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
  lightButton: {
    position: 'absolute',
    top: 480,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
  peopleButton: {
    position: 'absolute',
    top: 550,
    right: 20,
    backgroundColor: '#2a4a8b',
    padding: 15,
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#ffffff',
  },
});

export default FirstPersonNavigationScreen;
