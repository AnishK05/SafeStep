import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getDirections } from '../../utils/directionsService';
import { useTheme } from '../../contexts/ThemeContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const generateRandomRouteMetadata = () => {
  const crimeLevels = ["Low", "Moderate", "High"];
  const lightingConditions = ["Poorly-Lighted", "Moderately-Lighted", "Well-Lighted"];
  const activityStatuses = ["Quiet", "Moderate Activity", "Busy"];
  const constructionLevels = ["None", "Moderate", "Heavy"];

  const crimeLevel = crimeLevels[Math.floor(Math.random() * crimeLevels.length)];
  const lightingCondition = lightingConditions[Math.floor(Math.random() * lightingConditions.length)];
  const activityStatus = activityStatuses[Math.floor(Math.random() * activityStatuses.length)];
  const constructionLevel = constructionLevels[Math.floor(Math.random() * constructionLevels.length)];

  const safetyRating = calculateSafetyRating(crimeLevel, lightingCondition, activityStatus, constructionLevel);

  return {
    crimeLevel,
    lightingCondition,
    activityStatus,
    constructionLevel,
    safetyRating,
  };
};

// Function to calculate the safety rating based on metadata values
const calculateSafetyRating = (crimeLevel: string, lightingCondition: string, activityStatus: string, constructionLevel: string) => {
  let rating = 0;

  // Simple scoring system for each attribute
  if (crimeLevel === "Low") rating += 4;
  else if (crimeLevel === "Moderate") rating += 2;
  else rating += 1; // High

  if (lightingCondition === "Well-Lighted") rating += 4;
  else if (lightingCondition === "Moderately-Lighted") rating += 3;
  else rating += 1; // Poorly-Lighted

  if (activityStatus === "Busy") rating += 4;
  else if (activityStatus === "Moderate Activity") rating += 3;
  else rating += 2; // Quiet

  if (constructionLevel === "None") rating += 4;
  else if (constructionLevel === "Moderate") rating += 3;
  else rating += 1; // Heavy

  // Normalize the rating to a value between 1 and 5
  const maxPossibleScore = 16;
  const normalizedRating = (rating / maxPossibleScore) * 5;

  // Return the rating rounded to one decimal place
  return Math.round(normalizedRating * 10) / 10;
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
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [selectedRouteMetadata, setSelectedRouteMetadata] = useState<any>(null);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const [routesMetadata, setRoutesMetadata] = useState<any[]>([]);
  const [bestRouteIndex, setBestRouteIndex] = useState<number | null>(null);
  const { isDarkTheme } = useTheme();

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
            setRoutesData(routesData);

            // Generate and store metadata for each route
            const metadataArray = routesData.map(() => generateRandomRouteMetadata());
            setRoutesMetadata(metadataArray);

            // Determine the best route based on safety ratings
            const ratings = metadataArray.map(metadata => metadata.safetyRating);
            let highestRating = -1;
            let recommendedIndex = null;
            ratings.forEach((rating, index) => {
              if (rating > highestRating) {
                highestRating = rating;
                recommendedIndex = index;
              }
            });
            setBestRouteIndex(recommendedIndex);
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
    const selectedLeg = routesData[index]?.legs[0];
    const distance = selectedLeg?.distance?.text || "N/A";
    const duration = selectedLeg?.duration?.text || "N/A";

    // Use pre-generated metadata to ensure consistency
    const selectedMetadata = routesMetadata[index] || {};
    setSelectedRouteMetadata({
      ...selectedMetadata,
      distance,
      duration,
    });
    setIsPopUpVisible(true); // Show pop-up when a route is selected
  };

  const handleStartNavigation = () => {
    if (selectedRouteIndex !== null && routesData[0]?.legs?.[0]) {
      const distance = routesData[0].legs[0].distance?.text || 'N/A';
      const duration = routesData[0].legs[0].duration?.text || 'N/A';
  
      navigation.navigate('StartNavigation', {
        currentLocation,
        destination,
        selectedRoute: routes[selectedRouteIndex],
        selectedRouteLegs: routesData[selectedRouteIndex],
        totalDistance: distance,
        estimatedTime: duration,
      });
    } else {
      console.error('Invalid routesData structure:', routesData);
      // Handle error here
    }
  };
  

  const getIconColor = (level: string) => {
    switch (level) {
      case "Low":
      case "Well-Lighted":
      case "Busy":
      case "None":
        return "#7DCE82";
      case "Moderate":
      case "Moderately-Lighted":
      case "Moderate Activity":
        return "#F39237";
      case "High":
      case "Poorly-Lighted":
      case "Quiet":
      case "Heavy":
        return "#D63230";
      default:
        return "gray";
    }
  };

  return (
    <View style={[styles(isDarkTheme).container]}>
      <TouchableOpacity style={styles(isDarkTheme).backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={isDarkTheme ? 'white' : 'white'} />
      </TouchableOpacity>

      <MapView
        style={styles(isDarkTheme).map}
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
              strokeWidth={8}
              strokeColor={selectedRouteIndex === index ? 'blue' : 'gray'}
              tappable
              onPress={() => handleRouteSelect(index)}
            />
          ))}
      </MapView>

      {isPopUpVisible && selectedRouteMetadata && (
        <View style={styles(isDarkTheme).popUpContainer}>
          <TouchableOpacity onPress={() => setIsPopUpVisible(false)} style={styles(isDarkTheme).closeButton}>
            <Ionicons name="close-outline" size={24} color={isDarkTheme ? 'white' : 'black'} />
          </TouchableOpacity>

          <Text style={styles(isDarkTheme).popUpTitle}>Route Information</Text>

          {selectedRouteIndex === bestRouteIndex && (
            <Text style={styles(isDarkTheme).recommendedText}>Recommended Route!</Text>
          )}

          <Text style={styles(isDarkTheme).metadataText}>Distance: {selectedRouteMetadata.distance}</Text>
          <Text style={styles(isDarkTheme).metadataText}>Duration: {selectedRouteMetadata.duration}</Text>

          <View style={styles(isDarkTheme).iconRow}>
            <MaterialIcons name="security" size={30} color={getIconColor(selectedRouteMetadata.crimeLevel)} />
            <Ionicons name="bulb-outline" size={30} color={getIconColor(selectedRouteMetadata.lightingCondition)} />
            <Ionicons name="people-outline" size={30} color={getIconColor(selectedRouteMetadata.activityStatus)} />
            <FontAwesome6 name="road-barrier" size={30} color={getIconColor(selectedRouteMetadata.constructionLevel)} />
          </View>

          <View style={styles(isDarkTheme).safetyRatingRow}>
            <Text style={[styles(isDarkTheme).safetyRatingText, styles(isDarkTheme).safetyRatingLabel]}>Safety Rating:</Text>
            {Array.from({ length: Math.floor(selectedRouteMetadata.safetyRating) }).map((_, index) => (
              <Ionicons key={index} name="star" size={24} color="gold" style={styles(isDarkTheme).safetyStarIcon} />
            ))}
            {selectedRouteMetadata.safetyRating % 1 !== 0 && (
              <Ionicons name="star-half" size={24} color="gold" style={styles(isDarkTheme).safetyStarIcon} />
            )}
            <Text style={styles(isDarkTheme).safetyRatingText}>
              {selectedRouteMetadata.safetyRating}/5
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles(isDarkTheme).startNavigationButton,
          selectedRouteIndex === null && styles(isDarkTheme).disabledButton
        ]}
        onPress={handleStartNavigation}
        disabled={selectedRouteIndex === null}
      >
        <Text style={styles(isDarkTheme).startNavigationButtonText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (isDarkTheme: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5',
  },
  map: {
    flex: 1,
    borderRadius: 15,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkTheme ? '#1c2a48' : 'black',
    borderRadius: 50,
    width: 50,
    height: 50,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  screenTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: isDarkTheme ? '#ffffff' : '#000000',
  },
  startNavigationButton: {
    backgroundColor: isDarkTheme ? '#1c2a48' : '#2a4a8b',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  disabledButton: {
    backgroundColor: isDarkTheme ? '#555' : 'gray',
  },
  startNavigationButtonText: {
    color: isDarkTheme ? '#e0e0e0' : '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  popUpContainer: {
    position: 'absolute',
    bottom: 175,
    left: 20,
    right: 20,
    backgroundColor: isDarkTheme ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
  },
  popUpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: isDarkTheme ? '#ffffff' : '#000000',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  metadataText: {
    marginLeft: 10,
    fontSize: 12,
    color: isDarkTheme ? '#cccccc' : '#000000',
  },
  safetyRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  safetyRatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDarkTheme ? '#ffffff' : '#000000',
  },
  safetyRatingLabel: {
    paddingRight: 8,
  },
  safetyStarIcon: {
    paddingRight: 4,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
});

export default RouteScreen;
