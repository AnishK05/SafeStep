import React from 'react';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { GOOGLE_API_KEY } from '@env';

// Define the prop type for SearchBar
type SearchBarProps = {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
};

const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
  // Use React.RefObject<GooglePlacesAutocompleteRef> for the reference
  const searchBarRef = React.useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <GooglePlacesAutocomplete
      ref={searchBarRef} // Reference to the search bar for resetting the text input
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
        Keyboard.dismiss(); // Dismiss the keyboard when a location is selected
      }}
      query={{
        key: GOOGLE_API_KEY,
        language: 'en',
      }}
      fetchDetails={true}
      // Custom components for the input
      renderRightButton={() => (
        <TouchableOpacity
          onPress={() => {
            searchBarRef.current?.setAddressText(''); // Clear the input when the "X" is pressed
          }}
          style={{ justifyContent: 'center', marginRight: 10 }}
        >
          <Ionicons name="close-circle" size={24} color="gray" />
        </TouchableOpacity>
      )}
      // Customize styles
      styles={{
        textInputContainer: {
          flexDirection: 'row',
        },
        textInput: {
          height: 44,
          color: '#333333',
          fontSize: 16,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
        poweredContainer: {
          display: 'none', // Hide the attribution
        },
      }}
      textInputProps={{
        placeholderTextColor: '#5d5d5d', // Darker placeholder color
      }}
    />
  );
};

export default SearchBar;
