import { GOOGLE_API_KEY } from '@env';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const getDirections = async (
  origin: Coordinates,
  destination: Coordinates
) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.routes && json.routes.length > 0) {
      return json.routes[0]; // Return the first route with legs and steps
    } else {
      throw new Error("No routes found");
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
};
