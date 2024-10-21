import { RouteProp } from '@react-navigation/native';

// Define the Coordinates type (if not already defined elsewhere)
export type Coordinates = {
    latitude: number;
    longitude: number;
  };
  
  // Define the parameter list for the stack navigator
  export type RootStackParamList = {
    Home: undefined; // Home screen does not need any parameters
    Route: { currentLocation: Coordinates; destination: Coordinates }; // Route screen requires coordinates
    StartNavigation: { currentLocation: Coordinates; destination: Coordinates }; // StartNavigation screen also requires coordinates
  };
  
// For useRoute hook typing (optional)
export type RouteScreenRouteProp = RouteProp<RootStackParamList, 'Route'>;
export type StartNavigationRouteProp = RouteProp<RootStackParamList, 'StartNavigation'>;
