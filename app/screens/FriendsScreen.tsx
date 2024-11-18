import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigationTypes'; // Adjust the path if needed
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewComponent from '../../components/MapViewComponent';
import { getCurrentLocation } from '../../utils/locationService';
import { SafeAreaView } from 'react-native-safe-area-context';


type Coordinates = {
  latitude: number;
  longitude: number;
};

type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>;

const FriendsScreen = () => {
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      {/* <Text style={styles.screenTitle}>Friends Page</Text> */}
      <View>
      <MapView style={styles.mapArea}
        initialRegion= {INITIAL_REGION}
        showsUserLocation
      >
        <Marker style={styles.bluemarker} coordinate= {{
          latitude: 30.2862398,
          longitude: -97.7401890,
        }}
          image={require('../screens/aprilparker.png')}
          title = "April Parker"
          description='Peter T. Flawn Center'
      />
        <Marker style={styles.bluemarker} coordinate= {{
          latitude: 30.2840038,
          longitude: -97.7366958,
        }}
          image={require('../screens/logansharp.png')}
          title = "Logan Sharp"
          description='Gregory Gymnasium'
      />
        <Marker style={styles.bluemarker} coordinate= {{
          latitude: 30.2881416,
          longitude: -97.7352159,
        }}
          image={require('../screens/guspage.png')}
          title = "Gus Page"
          description='University of TX College-Pharm'
      />
        <Marker style={styles.bluemarker} coordinate= {{
          latitude: 29.9884212,
          longitude: -97.8766528,
        }}
          image={require('../screens/arilee.png')}
          title = "Ari Lee"
          description='Mary Kyle Hartson Park'
      />
      </MapView>
       </View>

        <ScrollView style={styles.friends}>
          {/* <TouchableOpacity style={styles.square} ></TouchableOpacity> */}
         <Text style={styles.names}>Friends</Text>
         <Image source ={require('../screens/upclosecat.png')} style={styles.profilepic} />
         <Text style={styles.person}>April Parker</Text>
         <Text style={styles.personLoc}>Austin, TX, Now</Text>
         <Image source ={require('../screens/logan.png')} style={styles.profilepic} />
         <Text style={styles.person}>Logan Sharp</Text>
         <Text style={styles.personLocTwo}>Austin, TX, 5 min. ago</Text>
         <Image source ={require('../screens/gus.png')} style={styles.profilepic} />
         <Text style={styles.person}>Gus Page</Text>
         <Text style={styles.personLocThree}>Austin, TX, 7 min. ago</Text>
         <Image source ={require('../screens/ari.png')} style={styles.profilepic} />
         <Text style={styles.person}>Ari Lee</Text>
         <Text style={styles.personLocFour}>Kyle, TX, 12 min. ago</Text>
         
         

        </ScrollView>

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
    //width: 340,
    height: 370, // Adjust map size
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  }, 
  bluemarker: {
    width: 60,
    height: 60,
  }, 
  friends: {
    backgroundColor: '#D3D3D3', 
    padding: 15,
    borderRadius: 10,
    width: 346,
    height: 220,
    //alignItems: 'left',
    //justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  }, 
  profilepic: {
    width: 45,
    height: 45,
    marginHorizontal: -5,
    marginVertical: 2,
  }, 
  names: {
    fontSize: 19,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  person: {
    fontSize: 17,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    wordWrap: 'row',
    marginVertical: -35,
    marginHorizontal: 50,
  }, 
  personLoc: {
     fontSize: 17,
     fontStyle: 'italic',
     marginVertical: 14,
     marginLeft: 150,
     //textAlign: 'right'
  }, 
  personLocTwo: {
    fontSize: 17,
    fontStyle: 'italic',
    marginVertical: 14,
    marginLeft: 158,
    //textAlign: 'right'
 }, 
 personLocThree: {
  fontSize: 17,
  fontStyle: 'italic',
  marginVertical: 14,
  marginLeft: 135,
  //textAlign: 'right'
}, 
personLocFour: {
  fontSize: 17,
  fontStyle: 'italic',
  marginVertical: 14,
  marginLeft: 113,
  //textAlign: 'right'
}, 
});

export default FriendsScreen;
