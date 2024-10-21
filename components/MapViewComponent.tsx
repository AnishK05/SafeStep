import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections } from '../utils/directionsService';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type MapViewProps = {
  currentLocation: Coordinates;
  destination: Coordinates | null;
};

const MapViewComponent = ({ currentLocation, destination }: MapViewProps) => {
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>([]);

  useEffect(() => {
    if (destination) {
      // Clear old route before fetching new directions
      setRouteCoords([]);
      
      // Fetch directions when destination is set
      getDirections(currentLocation, destination).then(route => {
        const coords = route.legs[0].steps.map((step: any) => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));
        setRouteCoords(coords);
      }).catch(error => {
        console.error('Error fetching directions:', error);
      });
    }
  }, [destination, currentLocation]);

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
    >
      <Marker coordinate={currentLocation} />
      {destination && <Marker coordinate={destination} />}
      {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={3} />}
    </MapView>
  );
};

export default MapViewComponent;
