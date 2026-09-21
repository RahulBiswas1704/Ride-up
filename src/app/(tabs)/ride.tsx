import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { useRideLocation } from '../../hooks/useRideLocation';
import { useCrashDetection } from '../../hooks/useCrashDetection';
import { useAgoraVoice } from '../../hooks/useAgoraVoice';
import { useSOSStore } from '../../store/useSOSStore';
import SOSCountdownOverlay from '../../components/SOSCountdownOverlay';
import VoiceCommsHUD from '../../components/VoiceCommsHUD';
import { Ionicons } from '@expo/vector-icons';

// Ultra-Dark Map Style JSON for react-native-maps
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{"color": "#111111"}] },
  { "elementType": "labels.text.stroke", "stylers": [{"color": "#111111"}] },
  { "elementType": "labels.text.fill", "stylers": [{"color": "#888888"}] },
  { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#aaaaaa"}] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#555555"}] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#181818"}] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{"color": "#222222"}] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#111111"}] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{"color": "#666666"}] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#333333"}] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#111111"}] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"}] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#333333"}] }
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

  useAgoraVoice();

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
    <View style={styles.container} className="bg-black">
      {/* Full-Screen Map */}
      <MapView 
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        initialRegion={{
          latitude: location[1],
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
              className={`w-5 h-5 rounded-full border-2 border-black shadow-[0_0_10px_rgba(255,94,0,0.8)] ${
                rider.isCaptain ? 'bg-[#FF5E00]' : 'bg-white'
              }`} 
            />
          </Marker>
        ))}

        {/* Route Polyline Layer */}
        <Polyline
          coordinates={MOCK_ROUTE}
          strokeColor="#FF5E00" // Brand Orange route
          strokeWidth={6}
          lineCap="round"
          lineJoin="round"
          geodesic={true}
        />
      </MapView>

      {/* HUD Overlays */}

      {/* Top Stats Bar - Digital Gauge Cluster */}
      <View className="absolute top-12 left-0 right-0 items-center pointer-events-none">
        <BlurView intensity={40} tint="dark" className="px-8 py-3 rounded-[30px] flex-row items-center overflow-hidden border border-white/10 shadow-xl">
          <View className="items-center mr-8">
            <Text className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Speed</Text>
            <Text className="text-white text-3xl font-light tracking-tighter">65 <Text className="text-[#FF5E00] text-sm font-bold tracking-normal">km/h</Text></Text>
          </View>
          <View className="w-[1px] h-10 bg-white/10" />
          <View className="items-center ml-8">
            <Text className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Distance</Text>
            <Text className="text-white text-3xl font-light tracking-tighter">120 <Text className="text-white/60 text-sm font-bold tracking-normal">km</Text></Text>
          </View>
        </BlurView>
      </View>

      {/* Developer Action: Simulate Crash (Subtle) */}
      <TouchableOpacity 
        className="absolute top-32 left-6 z-10 flex-row items-center opacity-40"
        onPress={handleSimulateCrash}
      >
        <Ionicons name="pulse" size={14} color="#FF3B30" />
        <Text className="text-[#FF3B30] font-bold text-[10px] uppercase tracking-widest ml-1">Simulate Crash</Text>
      </TouchableOpacity>
      
      {/* Primary Action: Mark Hazard */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 z-10"
        onPress={handleMarkHazard}
        activeOpacity={0.8}
      >
        <BlurView intensity={30} tint="dark" className="w-20 h-20 rounded-full items-center justify-center border border-white/20 shadow-xl overflow-hidden">
          <View className="bg-[#FF5E00]/20 w-16 h-16 rounded-full items-center justify-center border border-[#FF5E00]/50">
            <Ionicons name="warning-outline" size={28} color="#FF5E00" />
            <Text className="text-[#FF5E00] text-[8px] font-bold mt-1 tracking-widest">HAZARD</Text>
          </View>
        </BlurView>
      </TouchableOpacity>

      {/* Voice Comms HUD */}
      <VoiceCommsHUD />

      {/* Permissions Error Display */}
      {errorMsg && (
        <View className="absolute top-40 left-4 right-4 bg-red-500/90 border border-red-500 p-4 rounded-xl shadow-lg">
          <Text className="text-white font-bold text-center tracking-wider">{errorMsg}</Text>
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
