import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { GOOGLE_API_KEY } from '@env';

// Define the prop type for SearchBar
type SearchBarProps = {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
};

const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Where to..."
      onPress={(data, details = null) => {
        // Check if 'details' are available, otherwise log an error
        if (!details) {
          console.error("Location details not available");
          return;
        }
        if (details) {
          const location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };

          // Call the function from HomeScreen to handle the selected location
          onLocationSelect(location);
        }
      }}
      query={{
        key: GOOGLE_API_KEY,  // Replace with your actual Google API key
        language: 'en',
      }}
      fetchDetails={true}  // This ensures we get detailed info, including lat/lng
    />
  );
};

export default SearchBar;
