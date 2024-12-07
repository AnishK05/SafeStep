import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import SearchBar from '../../components/SearchBar';
import MapViewComponent from '../../components/MapViewComponent';
import { getCurrentLocation } from '../../utils/locationService';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Import the param list
import { useTheme } from '../../contexts/ThemeContext';

type Coordinates = {
  latitude: number;
  longitude: number;
};

// Define navigation type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const recentLocations = [
  { id: 1, name: 'Rise at West Campus', address: '2206 Nueces St, Austin, TX 78705', latitude: 30.283, longitude: -97.742 },
  { id: 2, name: "Coco's Cafe", address: '1910 Guadalupe St, Austin, TX 78705', latitude: 30.287, longitude: -97.740 },
  { id: 3, name: 'Pinch', address: '2011 Whitis Ave, Austin, TX 78705', latitude: 30.285, longitude: -97.743 }
];

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isDarkTheme, toggleTheme } = useTheme();
  const route = useRoute(); // Get the current route

  useEffect(() => {
    getCurrentLocation().then(location => {
      setCurrentLocation(location);
    }).catch(error => {
      console.error("Error getting location: ", error);
    });
  }, []);

  const handleLocationSelect = (destination: Coordinates) => {
    if (currentLocation) {
      navigation.navigate('Route', { currentLocation, destination });
    } else {
      console.error("Current location is null. Cannot navigate");
    }
  };

  const handleRecentClick = (location: { latitude: number; longitude: number }) => {
    handleLocationSelect(location);
  };

  const isActive = (routeName: string) => route.name === routeName;

   // Colors for active and inactive states
   const activeColor = isDarkTheme ? 'white' : '#585d69';
   const inactiveColor = isDarkTheme ? 'rgba(204, 204, 204, 0.5)' : 'rgba(128, 128, 128, 0.5)'; // Duller color with lower opacity for inactive icons

  return (
    <View style={styles(isDarkTheme).container}>
      <FlatList
        data={recentLocations}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View>
            <View style={styles(isDarkTheme).logoContainer}>
              <Image
                  source={require('../assets/Convergent_SafeStepLOGO.png')}
                  style={styles(isDarkTheme).logoImage}
                  resizeMode="contain"
                />
            </View>

            <SearchBar onLocationSelect={handleLocationSelect} isDarkTheme={isDarkTheme} />

            <View style={styles(isDarkTheme).recentHeader}>
              <Text style={styles(isDarkTheme).recentText}>Recent</Text>
              <Ionicons name="information-circle-outline" size={24} color={isDarkTheme ? '#ccc' : 'gray'} />
            </View>

          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} style={styles(isDarkTheme).recentItem} onPress={() => handleRecentClick(item)}>
            <MaterialIcons name="history" size={20} color={isDarkTheme ? '#ccc' : 'gray'} />
            <View style={styles(isDarkTheme).recentItemTextContainer}>
              <Text style={styles(isDarkTheme).recentItemName}>{item.name}</Text>
              <Text style={styles(isDarkTheme).recentItemAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View>
            <View style={styles(isDarkTheme).mapContainer}>
              {!currentLocation ? (
                <Text style={{ color: isDarkTheme ? '#ccc' : '#000' }}>Loading current location...</Text>
              ) : (
                <MapViewComponent currentLocation={currentLocation} destination={null} />
              )}
            </View>
          </View>
        )}
        keyboardShouldPersistTaps="always"
      />

      <View style={styles(isDarkTheme).bottomNav}>
        <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons
              name="home"
              size={24}
              color={isActive('Home') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Home') ? activeColor : inactiveColor }]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Favorites')}>
            <FontAwesome
              name="star"
              size={24}
              color={isActive('Favorites') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Favorites') ? activeColor : inactiveColor }]}>
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Friends')}>
            <FontAwesome
              name="smile-o"
              size={24}
              color={isActive('Friends') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Friends') ? activeColor : inactiveColor }]}>
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons
              name="person"
              size={24}
              color={isActive('Profile') ? activeColor : inactiveColor}
            />
            <Text style={[styles(isDarkTheme).navText, { color: isActive('Profile') ? activeColor : inactiveColor }]}>
              Profile
            </Text>
          </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = (isDarkTheme: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5', // Super dark blue background for dark theme
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 175,
    height: 80, // Adjust to fit logo dimensions
  },
  searchIcon: {
    marginLeft: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  recentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkTheme ? '#ffffff' : '#000000',
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
    color: isDarkTheme ? '#ffffff' : '#000000',
  },
  recentItemAddress: {
    fontSize: 12,
    color: isDarkTheme ? '#cccccc' : 'gray',
  },
  mapContainer: {
    height: 350,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50,
    backgroundColor: isDarkTheme ? '#1c2a48' : '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: isDarkTheme ? '#cccccc' : 'gray',
  },
});

export default HomeScreen;
