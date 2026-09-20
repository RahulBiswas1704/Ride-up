import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

interface UseCrashDetectionProps {
  onCrashDetected: () => void;
  threshold?: number;
}

export function useCrashDetection({ onCrashDetected, threshold = 4.0 }: UseCrashDetectionProps) {
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    // Set update interval to 100ms (10Hz)
    Accelerometer.setUpdateInterval(100);

    const subscribe = () => {
      subscriptionRef.current = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        
        // Calculate the magnitude of the acceleration vector
        // Resting on a table, the magnitude is ~1.0 (gravity)
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (magnitude > threshold) {
          onCrashDetected();
        }
      });
    };

    subscribe();

    return () => {
      // Clean up subscription on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, [onCrashDetected, threshold]);
}
