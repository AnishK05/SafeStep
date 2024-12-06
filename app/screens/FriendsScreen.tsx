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
      {/* <Text style={styles.screenTitle}>Friends Page</Text> */}
      <View>
      <MapView style={styles(isDarkTheme).mapArea}
        initialRegion= {INITIAL_REGION}
        showsUserLocation
      >
        <Marker style={styles(isDarkTheme).bluemarker} coordinate= {{
          latitude: 30.2862398,
          longitude: -97.7401890,
        }}
          image={require('../assets/images/aprilparker.png')}
          title = "April Parker" 
          description='Peter T. Flawn Center'
      />
        <Marker style={styles(isDarkTheme).bluemarker} coordinate= {{
          latitude: 30.2840038,
          longitude: -97.7366958,
        }}
          image={require('../assets/images/logansharp.png')}
          title = "Logan Sharp"
          description='Gregory Gymnasium'
      />
        <Marker style={styles(isDarkTheme).bluemarker} coordinate= {{
          latitude: 30.2881416,
          longitude: -97.7352159,
        }}
          image={require('../assets/images/guspage.png')}
          title = "Gus Page"
          description='University of TX College-Pharm'
      />
        <Marker style={styles(isDarkTheme).bluemarker} coordinate= {{
          latitude: 29.9884212,
          longitude: -97.8766528,
        }}
          image={require('../assets/images/arilee.png')}
          title = "Ari Lee"
          description='Mary Kyle Hartson Park'
      />
      </MapView>
       </View>

        <ScrollView style={styles(isDarkTheme).friends}>
          <Text style={styles(isDarkTheme).names}>Friends</Text>

          

          <View style={styles(isDarkTheme).personTest}>  
            <Image source ={require('../assets/images/upclosecat.png')} style={styles(isDarkTheme).profilepic} />
            <Text style={styles(isDarkTheme).person}>April Parker</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, Now</Text>
          </View>

          <View style={styles(isDarkTheme).personTest}>  
            <Image source ={require('../assets/images/logan.png')} style={styles(isDarkTheme).profilepic} />
            <Text style={styles(isDarkTheme).person}>Logan Parker</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 5 min. ago</Text>
          </View>

          <View style={styles(isDarkTheme).personTest}>  
            <Image source ={require('../assets/images/gus.png')} style={styles(isDarkTheme).profilepic} />
            <Text style={styles(isDarkTheme).person}>Gus Page</Text>
            <Text style={styles(isDarkTheme).personLoc}>Austin, TX, 7 min. ago</Text>
          </View>

          <View style={styles(isDarkTheme).personTest}>  
            <Image source ={require('../assets/images/ari.png')} style={styles(isDarkTheme).profilepic} />
            <Text style={styles(isDarkTheme).person}>Ari Lee</Text>
            <Text style={styles(isDarkTheme).personLoc}>Kyle, TX, 12 min. ago</Text>
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
  screenTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
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
  bluemarker: {
    width: 50,
    height: 50,
  }, 
  friends: {
    backgroundColor: isDarkTheme ? '#1c2a48' : '#D3D3D3', //backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    //marginHorizontal: 0,
    //width: 360,
    height: 220,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  }, 
  profilepic: {
    width: 45,
    height: 45,
    //alignSelf: 'flex-start',
   // paddingRight: 10,
  }, 
  names: {
    fontSize: 19,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    color: isDarkTheme ? '#ffffff' : '#000000',
  }, 
  person: {
    fontSize: 17,
    fontWeight: 'bold',
    flexDirection: 'row',
    //alignItems: 'center',
    wordWrap: 'row',
    //marginVertical: -35,
    marginLeft: 10,
    //resizeMode: 'contain',
    //padding: 0,
    
    color: isDarkTheme ? '#ffffff' : '#000000',
  }, 
  personLoc: {
     fontSize: 17,
     fontStyle: 'italic',
     paddingLeft: 10,
     //paddingRight: 0,
     justifyContent: 'space-between',
     color: isDarkTheme ? '#ffffff' : '#000000',
  }, 
  personLocTwo: {
    fontSize: 17,
    fontStyle: 'italic',
    marginVertical: 14,
    paddingLeft: 164,
    //alignSelf: 'flex-end',
    color: isDarkTheme ? '#ffffff' : '#000000',
 }, 
 personLocThree: {
  fontSize: 17,
  fontStyle: 'italic',
  marginVertical: 14,
  paddingLeft: 138,
  color: isDarkTheme ? '#ffffff' : '#000000',
}, 
personLocFour: {
  fontSize: 17,
  fontStyle: 'italic',
  marginVertical: 15,
  paddingLeft: 118,
  color: isDarkTheme ? '#ffffff' : '#000000',
}, 
callout: {
  // fontSize: 17,
  // fontStyle: 'italic',
  // marginVertical: 15,
  // marginLeft: 113,
  // color: isDarkTheme ? '#ffffff' : '#000000',
}, 
personTest: {
  //justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
},

});

export default FriendsScreen;