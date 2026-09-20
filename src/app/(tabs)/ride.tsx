import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useRideLocation } from '../../hooks/useRideLocation';
import { useCrashDetection } from '../../hooks/useCrashDetection';
import { useAgoraVoice } from '../../hooks/useAgoraVoice';
import { useSOSStore } from '../../store/useSOSStore';
import SOSCountdownOverlay from '../../components/SOSCountdownOverlay';
import VoiceCommsHUD from '../../components/VoiceCommsHUD';
import { Ionicons } from '@expo/vector-icons';

// Dark Mode Map Style JSON for react-native-maps
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#242f3e"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#242f3e"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#746855"}]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#d59563"}]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#d59563"}]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{"color": "#263c3f"}]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#6b9a76"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{"color": "#38414e"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#212a37"}]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#9ca5b3"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"color": "#746855"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#1f2835"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#f3d19c"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#17263c"}]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#515c6d"}]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#17263c"}]
  }
];

// Mock riders data
const MOCK_RIDERS = [
  {
    id: 'captain',
    isCaptain: true,
    latitude: 22.581,
    longitude: 88.471,
  },
  {
    id: 'rider-2',
    isCaptain: false,
    latitude: 22.579,
    longitude: 88.469,
  }
];

// Mock Route Polyline Data
const MOCK_ROUTE = [
  { latitude: 22.581, longitude: 88.471 },
  { latitude: 22.583, longitude: 88.474 },
  { latitude: 22.586, longitude: 88.472 },
  { latitude: 22.588, longitude: 88.475 },
  { latitude: 22.590, longitude: 88.473 },
  { latitude: 22.594, longitude: 88.478 },
];

export default function RideScreen() {
  const { location, errorMsg } = useRideLocation();
  const { triggerSOS } = useSOSStore();

  // Initialize Agora Engine (handles mounting/unmounting automatically)
  useAgoraVoice();

  // Wire up the physical crash detection hook
  const handleCrashDetected = useCallback(() => {
    console.log('Physical impact threshold exceeded!');
    triggerSOS();
  }, [triggerSOS]);

  useCrashDetection({
    onCrashDetected: handleCrashDetected,
    threshold: 4.0 // 4.0Gs
  });

  const handleMarkHazard = () => {
    Alert.alert('Hazard Marked', 'A hazard pin has been dropped at your current location.');
  };

  const handleSimulateCrash = () => {
    console.log('Simulating crash developer button pressed');
    triggerSOS();
  };

  return (
    <View style={styles.container} className="bg-background">
      {/* Full-Screen Map */}
      <MapView 
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        initialRegion={{
          latitude: location[1], // location is [long, lat]
          longitude: location[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Mock Riders Layer */}
        {MOCK_RIDERS.map((rider) => (
          <Marker
            key={rider.id}
            coordinate={{ latitude: rider.latitude, longitude: rider.longitude }}
          >
            <View 
              className={`w-4 h-4 rounded-full border-2 border-[#121212] ${
                rider.isCaptain ? 'bg-[#FF5E00]' : 'bg-[#E0FF00]'
              }`} 
            />
          </Marker>
        ))}

        {/* Route Polyline Layer */}
        <Polyline
          coordinates={MOCK_ROUTE}
          strokeColor="#E0FF00" // Neon Yellow route
          strokeWidth={6}
          lineCap="round"
          lineJoin="round"
          geodesic={true}
        />
      </MapView>

      {/* HUD Overlays */}

      {/* Top Stats Bar */}
      <View className="absolute top-12 left-0 right-0 items-center pointer-events-none">
        <View className="bg-surface/90 px-6 py-3 rounded-full flex-row items-center space-x-6 shadow-lg border border-gray-800">
          <View className="items-center mr-6">
            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider">Speed</Text>
            <Text className="text-white text-xl font-black">65 <Text className="text-textSecondary text-sm font-bold">km/h</Text></Text>
          </View>
          <View className="w-[1px] h-8 bg-gray-700 mx-2" />
          <View className="items-center ml-6">
            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider">Distance</Text>
            <Text className="text-white text-xl font-black">120 <Text className="text-textSecondary text-sm font-bold">km</Text></Text>
          </View>
        </View>
      </View>

      {/* Developer Action: Simulate Crash (Bottom Left) */}
      <TouchableOpacity 
        className="absolute bottom-8 left-6 bg-surface/80 px-4 py-2 rounded-full shadow-lg border border-gray-800 flex-row items-center"
        onPress={handleSimulateCrash}
      >
        <Ionicons name="pulse" size={16} color="#FF3B30" />
        <Text className="text-danger font-bold text-xs ml-2">Simulate Crash</Text>
      </TouchableOpacity>
      
      {/* Primary Action: Mark Hazard (Bottom Right) */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-primary w-20 h-20 rounded-full items-center justify-center shadow-xl border-4 border-black z-10"
        onPress={handleMarkHazard}
        activeOpacity={0.8}
      >
        <Ionicons name="warning-outline" size={36} color="#FFFFFF" />
        <Text className="text-white text-[10px] font-bold mt-1">HAZARD</Text>
      </TouchableOpacity>

      {/* Voice Comms HUD */}
      <VoiceCommsHUD />

      {/* Permissions Error Display */}
      {errorMsg && (
        <View className="absolute top-32 left-4 right-4 bg-danger p-4 rounded-xl shadow-lg">
          <Text className="text-white font-bold text-center">{errorMsg}</Text>
        </View>
      )}

      {/* High Priority Modals */}
      <SOSCountdownOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
