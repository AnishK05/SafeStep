import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Adjust the path if needed
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewComponent from '../../components/MapViewComponent';
import { getCurrentLocation } from '../../utils/locationService';


type Coordinates = {
  latitude: number;
  longitude: number;
};

type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>;

const FriendsScreen = () => {
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    getCurrentLocation().then(location => {
      setCurrentLocation(location);
    }).catch(error => {
      console.error("Error getting location: ", error);
    });
  }, []);


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Friends Page</Text>
      <View>
        <View style={styles.mapArea}>
          {!currentLocation ? (
            <Text>Loading current location...</Text>
          ) : (
               <MapViewComponent currentLocation={currentLocation} destination={null} />
          )}
          </View>
       </View>

      <View>
      <MapView>

      </MapView>
          <Marker coordinate= {{
            latitude: 30.2864470,
            longitude: 97.7439832
          }}
            image={require('../screens/bluefriendmarker.png')}
            title = "John"
          />
      </View>

      <View style={styles.friends}>
        {/* <TouchableOpacity style={styles.square} ></TouchableOpacity> */}
        <Text style={styles.names}>John Adams</Text>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <FontAwesome name="star" size={24} color="gray" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Friends')}>
          <FontAwesome name="smile-o" size={24} color="gray" />
          <Text style={styles.navText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: '#f5f5f5',
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
  bottomNav: {
    position: 'absolute', // Position it absolutely
    bottom: 0, // Align to the bottom of the screen
    left: 0,
    right: 0,
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
  mapArea: {
    height: 350, // Adjust map size
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  }, 
  bluemarker: {
    height: 350, // Adjust map size
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  }, 
  friends: {
    backgroundColor: '#ADD8E6', 
    padding: 15,
    borderRadius: 10,
    width: 370,
    height: 70,
    // alignItems: 'left',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  }, 
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFF',
  }, 
  names: {
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  }, 
});

export default FriendsScreen;
