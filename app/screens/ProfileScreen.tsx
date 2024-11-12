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
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
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
              <Text style={styles.profileName}>Jane Doe</Text>
            </TouchableOpacity>

            {/* Profile Buttons */}
            <View style={styles.profileButtonsContainer}>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileButtonText}>SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileButtonText}>Activity</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileButtonText}>Settings</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Options */}
            <View style={styles.profileOptions}>
              <View style={styles.option}>
                <Text style={styles.optionText}>Share My Location</Text>
                <Switch
                  value={isLocationEnabled}
                  onValueChange={setIsLocationEnabled}
                />
              </View>
              <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Emergency Contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Navigation Bar */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
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
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={24} color="purple" />
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    paddingBottom: 100, // Ensure scrolling space above the bottom nav
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
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
    paddingVertical: 40, // Increase vertical padding for taller buttons
    marginHorizontal: 5, // Space between buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    textAlign: 'center', // Ensure text is centered
  },
  profileOptions: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20, // Ensure enough space at the bottom
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ProfileScreen;
