import { GOOGLE_API_KEY } from '@env';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Step = {
  end_location: {
    lat: number;
    lng: number;
  };
};

type Leg = {
  steps: Step[];
};

type Route = {
  legs: Leg[];
};

export const getDirections = async (
  origin: Coordinates,
  destination: Coordinates
) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&alternatives=true&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.status !== 'OK') {
      console.error('Google Directions API error:', json.status);
      throw new Error(`Google Directions API error: ${json.status}`);
    }

    if (json.routes && json.routes.length > 0) {
      // Return all route data, including legs, for flexibility
      return json.routes.map((route: Route) => route);
    } else {
      throw new Error("No routes found");
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
};