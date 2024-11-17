import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/navigationTypes';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.contentContainer}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Profile Screen Content */}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {/* Profile Header */}
              <TouchableOpacity style={styles.profileHeader} onPress={pickImage}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: profileImage || 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                  />
                  {!profileImage && (
                    <Ionicons name="add-circle" size={30} color="gray" style={styles.plusIcon} />
                  )}
                </View>
                <Text style={styles.profileName}>Sarah Price</Text>
              </TouchableOpacity>

              {/* Profile Buttons */}
              <View style={styles.profileButtonsContainer}>
                <TouchableOpacity style={styles.profileButton}>
                  <Ionicons name="warning" size={30} color="#cd1c18" />
                  <Text style={[styles.profileButtonText, { color: '#cd1c18' }]}>SOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <Ionicons name="analytics" size={30} color="black" />
                  <Text style={styles.profileButtonText}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <Ionicons name="settings" size={30} color="black" />
                  <Text style={styles.profileButtonText}>Settings</Text>
                </TouchableOpacity>
              </View>

              {/* Profile Options with left-aligned text */}
              <View style={styles.profileOptions}>
                <View style={styles.option}>
                  <Ionicons name="location-outline" size={24} color="black" />
                  <Text style={styles.optionText}>Share My Location</Text>
                  <View style={styles.switchContainer}>
                    <Switch value={isLocationEnabled} onValueChange={setIsLocationEnabled} />
                  </View>
                </View>
                <TouchableOpacity style={styles.option}>
                  <Ionicons name="person-add-outline" size={24} color="black" />
                  <Text style={styles.optionText}>Emergency Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                  <Ionicons name="help-circle-outline" size={24} color="black" />
                  <Text style={styles.optionText}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                  <Ionicons name="information-circle-outline" size={24} color="black" />
                  <Text style={styles.optionText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                  <Text style={styles.optionText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  profileButton: {
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  profileButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  profileOptions: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align text to the left
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10, // Space between icon and text
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
    fontSize: 12, // Adjust text size for the bottom navigation
    color: 'gray',
  },
});

export default ProfileScreen;
