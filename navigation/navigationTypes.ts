import { RouteProp } from '@react-navigation/native';

// Define the Coordinates type (if not already defined elsewhere)
export type Coordinates = {
    latitude: number;
    longitude: number;
};
  
// Define the parameter list for the stack navigator
export type RootStackParamList = {
    // Home screen does not need any parameters
    Home: undefined; 
    // Route screen requires coordinates and an optional selectedRoute
    Route: { currentLocation: Coordinates; destination: Coordinates; selectedRoute?: Coordinates[] }; 
    // StartNavigation screen also requires coordinates and selectedRoute
    StartNavigation: { currentLocation: Coordinates; destination: Coordinates; selectedRoute: Coordinates[]; selectedRouteLegs: any; totalDistance: string; estimatedTime: string; };
    Favorites: undefined;
    Friends: undefined;
    Profile: undefined;


};
  
// For useRoute hook typing (optional)
export type RouteScreenRouteProp = RouteProp<RootStackParamList, 'Route'>;
export type StartNavigationRouteProp = RouteProp<RootStackParamList, 'StartNavigation'>;
