import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import SearchBar from '../../components/SearchBar';
import MapViewComponent from '../../components/MapViewComponent';
import { getCurrentLocation } from '../../utils/locationService';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Import the param list

type Coordinates = {
  latitude: number;
  longitude: number;
};

// Define navigation type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const recentLocations = [
  { id: 1, name: 'Rise at West Campus', address: '2206 Nueces St, Austin, TX 78705', latitude: 30.283, longitude: -97.742 },
  { id: 2, name: "Coco's Cafe", address: '1910 Guadalupe St, Austin, TX 78705', latitude: 30.287, longitude: -97.740 },
  { id: 3, name: 'Pinch', address: '2011 Whitis Ave, Austin, TX 78705', latitude: 30.285, longitude: -97.743  }
];

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Typed navigation

  useEffect(() => {
    getCurrentLocation().then(location => {
      setCurrentLocation(location);
    }).catch(error => {
      console.error("Error getting location: ", error);
    });
  }, []);

  const handleLocationSelect = (destination: Coordinates) => {
    if (currentLocation) {
      navigation.navigate('Route', { currentLocation, destination }); // Type-safe navigation
    } else {
      console.error("Current location is null. Cannot navigate"); // Debugging
    }
  };

  const handleRecentClick = (location: { latitude: number; longitude: number }) => {
    handleLocationSelect(location);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recentLocations}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>SafeStep</Text>
            </View>

            <View style={styles.searchContainer}>
              <SearchBar onLocationSelect={handleLocationSelect} />
              <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
            </View>

            <View style={styles.recentHeader}>
              <Text style={styles.recentText}>Recent</Text>
              <Ionicons name="information-circle-outline" size={24} color="gray" />
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} style={styles.recentItem} onPress={() => handleRecentClick(item)}>
            <MaterialIcons name="history" size={20} color="gray" />
            <View style={styles.recentItemTextContainer}>
              <Text style={styles.recentItemName}>{item.name}</Text>
              <Text style={styles.recentItemAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View>
            <View style={styles.mapContainer}>
              {!currentLocation ? (
                <Text>Loading current location...</Text>
              ) : (
                <MapViewComponent currentLocation={currentLocation} destination={null} />
              )}
            </View>
          </View>
        )}
        keyboardShouldPersistTaps="always"  // Important for Google Places interaction
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="star" size={24} color="gray" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="smile-o" size={24} color="gray" />
          <Text style={styles.navText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="gray" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  recentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  recentItemTextContainer: {
    marginLeft: 10,
  },
  recentItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentItemAddress: {
    fontSize: 12,
    color: 'gray',
  },
  mapContainer: {
    height: 350, // Adjust map size
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50, // Add padding for bottom navigation
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12, // Adjust text size for bottom nav
    color: 'gray',
  },
});

export default HomeScreen;
