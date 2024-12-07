import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Adjust the path if needed
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewComponent from '../../components/MapViewComponent';
import { getCurrentLocation } from '../../utils/locationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';


type Coordinates = {
  latitude: number;
  longitude: number;
};

type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>;

const FriendsScreen = () => {
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const { isDarkTheme } = useTheme();
  const activeColor = isDarkTheme ? 'white' : '#585d69';
  const inactiveColor = isDarkTheme ? 'rgba(204, 204, 204, 0.5)' : 'rgba(128, 128, 128, 0.5)'; // Duller color with lower opacity for inactive icons
  const isActive = (routeName: string) => route.name === routeName;
  const route = useRoute(); // Get the current route

  const INITIAL_REGION = {
    latitude: 30.2864002,
    longitude: -97.7370146,
    latitudeDelta: .0095,
    longitudeDelta: .0095,
  };

  useEffect(() => {
    getCurrentLocation().then(location => {
      setCurrentLocation(location);
    }).catch(error => {
      console.error("Error getting location: ", error);
    });
  }, []);


  return (

    <View style={styles(isDarkTheme).container}>

      <TouchableOpacity style={styles(isDarkTheme).backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={isDarkTheme ? 'white' : 'white'} />
      </TouchableOpacity>
      
      <View>
        <MapView style={styles(isDarkTheme).mapArea}
          initialRegion= {INITIAL_REGION}
          showsUserLocation
        >
          {/* Miranda */}
          <Marker
            coordinate={{
              latitude: 30.2867,
              longitude: -97.7412,
            }}
            title="Miranda"
            description="Texas Union"
            anchor={{ x: 0.5, y: 0.5 }}
            calloutAnchor={{ x: 0.5, y: 0.3 }}
          >
            <View style={styles(isDarkTheme).markerContainer}>
              <Image
                source={require('../assets/images/miranda.png')}
                style={styles(isDarkTheme).markerImage}
              />
            </View>
          </Marker>

          {/* Anish */}
          <Marker
            coordinate={{
              latitude: 30.2827,
              longitude: -97.7382,
            }}
            title="Anish"
            description="PCL"
            anchor={{ x: 0.5, y: 0.5 }}
            calloutAnchor={{ x: 0.5, y: 0.3 }}
          >
            <View style={styles(isDarkTheme).markerContainer}>
              <Image
                source={require('../assets/images/anish.png')}
                style={styles(isDarkTheme).markerImage}
              />
            </View>
          </Marker>

          {/* Krisha */}
          <Marker
            coordinate={{
              latitude: 30.2840038,
              longitude: -97.7366958,
            }}
            title="Krisha"
            description="Gregory Gym"
            anchor={{ x: 0.5, y: 0.5 }}
            calloutAnchor={{ x: 0.5, y: 0.3 }}
          >
            <View style={styles(isDarkTheme).markerContainer}>
              <Image
                source={require('../assets/images/krisha.png')}
                style={styles(isDarkTheme).markerImage}
              />
            </View>
          </Marker>

          {/* Surya */}
          <Marker
            coordinate={{
              latitude: 30.2881,
              longitude: -97.7355,
            }}
            title="Surya"
            description="EER"
            anchor={{ x: 0.5, y: 0.5 }}
            calloutAnchor={{ x: 0.5, y: 0.3 }}
          >
            <View style={styles(isDarkTheme).markerContainer}>
              <Image
                source={require('../assets/images/surya.png')}
                style={styles(isDarkTheme).markerImage}
              />
            </View>
          </Marker>

          {/* Shreya */}
          <Marker
            coordinate={{
              latitude: 30.28885,
              longitude: -97.73835,
            }}
            title="Shreya"
            description="Burdine Hall"
            anchor={{ x: 0.5, y: 0.5 }}
            calloutAnchor={{ x: 0.5, y: 0.3 }}
          >
            <View style={styles(isDarkTheme).markerContainer}>
              <Image
                source={require('../assets/images/shreya.png')}
                style={styles(isDarkTheme).markerImage}
              />
            </View>
          </Marker>
        </MapView>
      </View>

      <Text style={styles(isDarkTheme).names}>Friends</Text>

      <ScrollView style={styles(isDarkTheme).friends}>
        
        {/** Miranda */}
        <View style={styles(isDarkTheme).friendItem}>
          <Image source={require('../assets/images/miranda.png')} style={styles(isDarkTheme).profilepic} />
          <View style={styles(isDarkTheme).friendInfo}>
            <Text style={styles(isDarkTheme).person}>Miranda</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, Now</Text>
          </View>
        </View>

        {/** Anish */}
        <View style={styles(isDarkTheme).friendItem}>
          <Image source={require('../assets/images/anish.png')} style={styles(isDarkTheme).profilepic} />
          <View style={styles(isDarkTheme).friendInfo}>
            <Text style={styles(isDarkTheme).person}>Anish</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 3 min. ago</Text>
          </View>
        </View>

        {/** Krisha */}
        <View style={styles(isDarkTheme).friendItem}>
          <Image source={require('../assets/images/krisha.png')} style={styles(isDarkTheme).profilepic} />
          <View style={styles(isDarkTheme).friendInfo}>
            <Text style={styles(isDarkTheme).person}>Krisha</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 15 min. ago</Text>
          </View>
        </View>

        {/** Surya */}
        <View style={styles(isDarkTheme).friendItem}>
          <Image source={require('../assets/images/surya.png')} style={styles(isDarkTheme).profilepic} />
          <View style={styles(isDarkTheme).friendInfo}>
            <Text style={styles(isDarkTheme).person}>Surya</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 32 min. ago</Text>
          </View>
        </View>

        {/** Shreya */}
        <View style={styles(isDarkTheme).friendItem}>
          <Image source={require('../assets/images/shreya.png')} style={styles(isDarkTheme).profilepic} />
          <View style={styles(isDarkTheme).friendInfo}>
            <Text style={styles(isDarkTheme).person}>Shreya</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 28 min. ago</Text>
          </View>
        </View>

        
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkTheme ? '#1c2a48' : 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: '#54A2C9', // Blue ring color
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54A2C9',
  },
  markerImage: {
    width: 35, // Updated image size
    height: 35,
    borderRadius: 17.5, // Half of width/height for circular images
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
  mapArea: {
    //width: 340,
    height: 370, // Adjust map size
    //marginHorizontal: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
  }, 
  // Container styles
  friends: {
    backgroundColor: isDarkTheme ? '#1c2a48' : '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingLeft: 20,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 10,
    borderRadius: 10,
    flex: 1,
  },
  names: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkTheme ? '#ffffff' : '#000000',
    marginTop: 10,
    marginBottom: 10, 
    marginLeft: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkTheme ? '#333' : '#e0e0e0',
    paddingBottom: 10,
  },
  profilepic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  person: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkTheme ? '#ffffff' : '#000000',
    marginBottom: 4,
  },
  personLoc: {
    fontSize: 14,
    fontStyle: 'italic',
    color: isDarkTheme ? '#cccccc' : '#666666',
  },

});

export default FriendsScreen;