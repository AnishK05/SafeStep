import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getDirections } from '../../utils/directionsService';

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

  // Calculate a fake safety rating
  const safetyRating = calculateSafetyRating(crimeLevel, lightingCondition, activityStatus, constructionLevel);
  const reviewCount = Math.floor(Math.random() * 3000) + 100 // Random number of reviews between 100 and 3000

  return {
    crimeLevel,
    lightingCondition,
    activityStatus,
    constructionLevel,
    safetyRating,
    reviewCount,
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
  
    setSelectedRouteMetadata({
      ...generateRandomRouteMetadata(),
      distance,
      duration,
    });
    setIsPopUpVisible(true); // Show pop-up when a route is selected
  };
  

  const handleStartNavigation = () => {
    if (selectedRouteIndex !== null) {
      navigation.navigate('StartNavigation', {
        currentLocation,
        destination,
        selectedRoute: routes[selectedRouteIndex],
        selectedRouteLegs: routesData[selectedRouteIndex],
      });
    }
  };

  const getIconColor = (level: string) => {
    switch (level) {
      case "Low":
      case "Well-Lighted":
      case "Quiet":
      case "None":
        return "green";
      case "Moderate":
      case "Moderately-Lighted":
      case "Moderate Activity":
        return "orange";
      case "High":
      case "Poorly-Lighted":
      case "Busy":
      case "Heavy":
        return "red";
      default:
        return "gray";
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

      {isPopUpVisible && selectedRouteMetadata && (
        <View style={styles.popUpContainer}>
          <TouchableOpacity onPress={() => setIsPopUpVisible(false)} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.popUpTitle}>Route Information</Text>
          <Text style={styles.metadataText}>Distance: {selectedRouteMetadata.distance}</Text>
          <Text style={styles.metadataText}>Duration: {selectedRouteMetadata.duration}</Text>
          
          {/* Single Row Layout for All Flags */}
          <View style={styles.iconRow}>
            <MaterialIcons name="security" size={30} color={getIconColor(selectedRouteMetadata.crimeLevel)} />
            <Ionicons name="bulb-outline" size={30} color={getIconColor(selectedRouteMetadata.lightingCondition)} />
            <Ionicons name="people-outline" size={30} color={getIconColor(selectedRouteMetadata.activityStatus)} />
            <Ionicons name="construct-outline" size={30} color={getIconColor(selectedRouteMetadata.constructionLevel)} />

          </View>

          {/* Safety Rating */}
          <View style={styles.safetyRatingRow}>
            <Text style={[styles.safetyRatingText, styles.safetyRatingLabel]}>Safety:</Text>
            {/* Generate stars based on the safety rating */}
            {Array.from({ length: Math.floor(selectedRouteMetadata.safetyRating) }).map((_, index) => (
              <Ionicons key={index} name="star" size={24} color="gold" style={styles.safetyStarIcon} />
            ))}
            {/* Display a half-star if applicable */}
            {selectedRouteMetadata.safetyRating % 1 !== 0 && (
              <Ionicons name="star-half" size={24} color="gold" style={styles.safetyStarIcon} />
            )}
            <Text style={styles.safetyRatingText}>
              {selectedRouteMetadata.safetyRating}/5
            </Text>
            <Text style={styles.reviewCountText}>({selectedRouteMetadata.reviewCount} reviews)</Text>
          </View>
          
        </View>
      )}

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
  popUpContainer: {
    position: 'absolute',
    bottom: 175,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
  },
  popUpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row', // Ensure items are laid out horizontally
    justifyContent: 'space-evenly', // Add spacing between icons
    alignItems: 'center', // Center items vertically
    marginTop: 10, // Optional: Add some top margin
  },  
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it appears above other elements
  },  
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  metadataText: {
    marginLeft: 10,
    fontSize: 12,
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
  },
  safetyRatingLabel: {
    paddingRight: 8,
  },
  safetyStarIcon: {
    paddingRight: 4,
  },
  reviewCountText: {
    fontSize: 12,
    marginLeft: 4,
    color: 'gray'
  },
});

export default RouteScreen;
