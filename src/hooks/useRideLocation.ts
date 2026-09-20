import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

type Coordinates = [number, number]; // [longitude, latitude] for Mapbox

export function useRideLocation() {
  // Default to Newtown, West Bengal as requested [longitude, latitude]
  const [location, setLocation] = useState<Coordinates>([88.47, 22.58]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Initial get to populate quickly
      try {
        let initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation([initialLocation.coords.longitude, initialLocation.coords.latitude]);
      } catch (e) {
        console.warn("Could not get initial location immediately, relying on watch");
      }

      // Watch position for continuous updates
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation([newLocation.coords.longitude, newLocation.coords.latitude]);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location, errorMsg };
}
