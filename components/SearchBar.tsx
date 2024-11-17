import React from 'react';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { GOOGLE_API_KEY } from '@env';

// Define the prop type for SearchBar
type SearchBarProps = {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  isDarkTheme: boolean; // New prop for theme
};

const SearchBar = ({ onLocationSelect, isDarkTheme }: SearchBarProps) => {
  // Use React.RefObject<GooglePlacesAutocompleteRef> for the reference
  const searchBarRef = React.useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkTheme ? '#1c2a48' : '#fff', // Background color based on theme
      borderRadius: 40,
      marginHorizontal: 20,
      shadowColor: isDarkTheme ? '#000' : '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
    }}>
      <GooglePlacesAutocomplete
        ref={searchBarRef}
        placeholder="Where to?"
        onPress={(data, details = null) => {
          if (!details) {
            console.error("Location details not available");
            return;
          }
          const location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };

          onLocationSelect(location);
          Keyboard.dismiss();
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          textInputContainer: {
            flexDirection: 'row',
            backgroundColor: 'transparent',
          },
          listView: {
            backgroundColor: isDarkTheme ? '#1c2a48' : '#ffffff', // Background color for suggestions
            margin: 0,
          },
          row: {
            backgroundColor: isDarkTheme ? '#1c2a48' : '#ffffff',
            padding: 10,
            height: 44,
            flexDirection: 'row',
          },
          description: {
            color: isDarkTheme ? '#ffffff' : '#000000', // Text color for the suggestions
          },
          textInput: {
            height: 44,
            color: isDarkTheme ? '#ffffff' : '#333333', 
            fontSize: 16,
            backgroundColor: 'transparent',
          },
          predefinedPlacesDescription: {
            color: isDarkTheme ? '#ffffff' : '#1faadb',
          },
          poweredContainer: {
            display: 'none',
            height: 0,
            margin: 0,
            padding: 0,
          },
        }}
        textInputProps={{
          placeholderTextColor: isDarkTheme ? '#aaaaaa' : '#5d5d5d',
        }}
      />
      <TouchableOpacity
        onPress={() => {
          searchBarRef.current?.setAddressText('');
        }}
        style={{ justifyContent: 'center', marginLeft: 10 }}
      >
        <Ionicons name="search" size={24} color={isDarkTheme ? '#ccc' : 'gray'} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
