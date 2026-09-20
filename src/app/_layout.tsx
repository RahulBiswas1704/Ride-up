import "../global.css";
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, initialized, initAuthListener } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  const [loaded] = useFonts({
    // Inter: require('../assets/fonts/Inter-Regular.ttf'),
  });

  // Start listening to Firebase Auth state on app load
  useEffect(() => {
    initAuthListener();
  }, []);

  // Hide splash screen when fonts are loaded and auth is initialized
  useEffect(() => {
    if (loaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, initialized]);

  // Auth Guard
  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not signed in? Redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Signed in and trying to access auth screens? Redirect to home
      router.replace('/(tabs)');
    }
  }, [user, initialized, segments]);

  if (!loaded || !initialized) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
