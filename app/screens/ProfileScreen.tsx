import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/navigationTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../contexts/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';



type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isDarkEnabled, setIsDarkEnabled] = useState(true);
  
  const [profileImage, setProfileImage] = useState<string>(
    'https://alcalde.texasexes.org/bevoxv/img/bevomobile.jpg'
  );

  
  
  const { isDarkTheme, toggleTheme } = useTheme();
  const imageUri = profileImage || 'https://alcalde.texasexes.org/bevoxv/img/bevomobile.jpg';

<Image
  source={{ uri: imageUri }}
  style={styles(isDarkTheme).profileImage}
/>


  const saveImageToStorage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
    } catch (error) {
      console.error('Failed to save profile image:', error);
    }
  };

  const loadImageFromStorage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Failed to load profile image:', error);
    }
  };
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Need access to camera roll.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      saveImageToStorage(uri);
    }
  };
  

  useEffect(() => {
    loadImageFromStorage();
  }, []);


  return (
    <View style={styles(isDarkTheme).container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles(isDarkTheme).contentContainer}>
            {/* Back Button */}
            <TouchableOpacity style={styles(isDarkTheme).backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Profile Screen Content */}
            <ScrollView contentContainerStyle={styles(isDarkTheme).scrollViewContent}>
              {/* Profile Header */}
              <TouchableOpacity style={styles(isDarkTheme).profileHeader} onPress={pickImage}>
              <View style={styles(isDarkTheme).profileHeader}>

                <View style={styles(isDarkTheme).profileImageContainer}>
                  <Image
                    source={{
                      uri:'https://alcalde.texasexes.org/bevoxv/img/bevomobile.jpg',
                    }}
                    style={styles(isDarkTheme).profileImage}
                  />
                  {!profileImage && (
                    <Entypo name="circle-with-plus" size={24} color="black" style={styles(isDarkTheme).plusIcon} />
                  )}
                </View>
                <Text style={styles(isDarkTheme).profileName}>Sarah Price</Text>
                </View>
              </TouchableOpacity>



              {/* Profile Buttons */}
              <View style={styles(isDarkTheme).profileButtonsContainer}>
                <TouchableOpacity style={styles(isDarkTheme).profileButton}>
                  <Ionicons name="warning" size={30} color="#cd1c18" />
                  <Text style={[styles(isDarkTheme).profileButtonText, { color: '#cd1c18' }]}>SOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles(isDarkTheme).profileButton}>
                  <Ionicons name="analytics" size={34} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).profileButtonText}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles(isDarkTheme).profileButton}>
                  <Ionicons name="settings" size={30} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).profileButtonText}>Settings</Text>
                </TouchableOpacity>
              </View>

              {/* Profile Options with left-aligned text */}
              <View style={styles(isDarkTheme).profileOptions}>
                <View style={styles(isDarkTheme).option}>
                <FontAwesome name="location-arrow" size={22} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>Share My Location</Text>
                  <View style={styles(isDarkTheme).switchContainer}>
                    <Switch value={isLocationEnabled} onValueChange={setIsLocationEnabled} />
                  </View>
                </View>
            
                <TouchableOpacity style={styles(isDarkTheme).option}>
                  <MaterialCommunityIcons name="hospital" size={22} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>Emergency Contacts</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(isDarkTheme).option}>
                  <Ionicons name="help-circle" size={22} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>Help</Text>
                </TouchableOpacity>
                <View style={styles(isDarkTheme).option}>
                  <Ionicons name="moon" size={20} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>Dark Mode</Text>
                  <View style={styles(isDarkTheme).switchContainer}>
                  <Switch
                    value={isDarkTheme}
                    onValueChange={toggleTheme} // Use the toggleTheme function for switching dark mode
                  />
                  </View>
                </View>
                <TouchableOpacity style={styles(isDarkTheme).option}>
                  <Ionicons name="information-circle" size={22} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles(isDarkTheme).option}>
                  <Ionicons name="log-out" size={22} color={isDarkTheme ? 'white' : 'black'} />
                  <Text style={styles(isDarkTheme).optionText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Bottom Navigation Bar */}
          <View style={styles(isDarkTheme).bottomNav}>
            <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="home" size={24} color="gray" />
              <Text style={styles(isDarkTheme).navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Favorites')}>
              <FontAwesome name="star" size={24} color="gray" />
              <Text style={styles(isDarkTheme).navText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Friends')}>
              <FontAwesome name="smile-o" size={24} color="gray" />
              <Text style={styles(isDarkTheme).navText}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(isDarkTheme).navItem} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={24} color="white" />
              <Text style={styles(isDarkTheme).navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = (isDarkTheme: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkTheme ? '#0b1a34' : '#f5f5f5', // Super dark blue background for dark theme
  },
  themeToggleButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    width: 80, 
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    zIndex: 1,
    backgroundColor: isDarkTheme ? '#1c2a48' : '#ddd',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 5,
    
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
  scrollViewContent: {
    paddingBottom: 20, // Adds spacing for scrolling content
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    paddingBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    color: isDarkTheme ? '#ffffff' : '#000000',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkTheme ? '#ffffff' : '#000000',
    paddingBottom: 10,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 0,
    color: isDarkTheme ? '#585D69' : '#ddd',
    
  },
  profileButton: {
    flex: 1,
    backgroundColor: isDarkTheme ? '#585D69' : '#ddd', // Dynamically set background color
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  profileButtonText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: isDarkTheme ? '#F1F1F1' : '#191C24', // Dynamic text color
    fontWeight: 'bold',
  },  
  profileOptions: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align text to the left
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10, // Space between icon and text
    color: isDarkTheme ? '#F1F1F1' : '#191C24', // Dynamic text color
  },
  switchContainer: {
    position: 'absolute', // Take the Switch out of the regular flow
    right: 20,
  },
  bottomNav: {
    position: 'absolute', // Navigation bar stays at the bottom
    bottom: 0, // Aligns to very bottom of the screen
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50, // Add padding for bottom navigation
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
    fontSize: 12, // Adjust text size for the bottom navigation
    color: isDarkTheme ? '#ffffff' : '#1c2a48',
  },
});

export default ProfileScreen;