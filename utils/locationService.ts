import * as Location from 'expo-location';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const getCurrentLocation = async (): Promise<Coordinates> => {
  // Request permission to access the device's location
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  // Get the user's current location
  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
