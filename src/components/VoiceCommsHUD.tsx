import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceStore } from '../store/useVoiceStore';

export default function VoiceCommsHUD() {
  const { 
    isConnected, 
    isMuted, 
    channelId, 
    connectedRidersCount, 
    speakingUids,
    joinChannel, 
    leaveChannel, 
    toggleMute 
  } = useVoiceStore();

  const handleJoin = () => {
    // Hardcoded channel for prototype
    joinChannel('group-ride-alpha');
  };

  // Determine if someone is talking (including local user uid=0)
  const isSomeoneTalking = speakingUids.length > 0;

  if (!isConnected) {
    return (
      <View className="absolute bottom-32 left-6 right-6">
        <TouchableOpacity 
          className="bg-surface/90 border border-gray-700 py-4 px-6 rounded-2xl shadow-xl flex-row justify-between items-center"
          onPress={handleJoin}
        >
          <View>
            <Text className="text-textSecondary font-bold uppercase text-xs">Comms Offline</Text>
            <Text className="text-white font-black text-lg">Join Intercom</Text>
          </View>
          <View className="bg-primary/20 p-3 rounded-full">
            <Ionicons name="headset" size={24} color="#FF5E00" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="absolute bottom-32 left-6 right-6 bg-surface/95 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden p-4">
      {/* Header Info */}
      <View className="flex-row justify-between items-center mb-4 px-2">
        <View>
          <Text className="text-primary font-bold text-xs uppercase tracking-wider">
            {channelId}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="people" size={14} color="#A1A1AA" />
            <Text className="text-textSecondary font-bold ml-1">
              {connectedRidersCount} Riders Connected
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-danger/20 px-3 py-1.5 rounded-full border border-danger/50"
          onPress={leaveChannel}
        >
          <Text className="text-danger font-bold text-xs uppercase">Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Main Controls */}
      <View className="flex-row items-center justify-between">
        
        {/* Speaking Indicator */}
        <View className="flex-1 items-center justify-center">
           {isSomeoneTalking ? (
             <View className="flex-row items-center">
               <View className="w-3 h-3 rounded-full bg-success animate-pulse mr-2" />
               <Text className="text-success font-bold">Transmitting...</Text>
             </View>
           ) : (
             <Text className="text-textSecondary font-bold italic">Channel Quiet</Text>
           )}
        </View>

        {/* Massive PTT / Mute Toggle */}
        <TouchableOpacity 
          className={`w-20 h-20 rounded-full items-center justify-center shadow-lg border-4 ${
            isMuted ? 'bg-surface border-danger' : 'bg-success border-success'
          }`}
          onPress={toggleMute}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isMuted ? 'mic-off' : 'mic'} 
            size={36} 
            color={isMuted ? '#FF3B30' : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
