import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
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
          onPress={handleJoin}
          activeOpacity={0.8}
        >
          <BlurView intensity={30} tint="dark" className="border border-white/10 py-5 px-6 rounded-[24px] shadow-xl flex-row justify-between items-center overflow-hidden">
            <View>
              <Text className="text-white/60 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Comms Offline</Text>
              <Text className="text-white font-light text-xl tracking-widest">JOIN INTERCOM</Text>
            </View>
            <View className="bg-[#FF5E00]/20 p-4 rounded-full border border-[#FF5E00]/30">
              <Ionicons name="headset" size={24} color="#FF5E00" />
            </View>
          </BlurView>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="absolute bottom-32 left-6 right-6">
      <BlurView intensity={40} tint="dark" className="border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-5">
        {/* Header Info */}
        <View className="flex-row justify-between items-center mb-6 px-1">
          <View>
            <Text className="text-[#FF5E00] font-black text-sm uppercase tracking-[0.2em]">
              {channelId}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 rounded-full bg-[#4ADE80] mr-2 animate-pulse" />
              <Text className="text-white/70 font-bold text-xs tracking-widest uppercase">
                {connectedRidersCount} Riders Connected
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-white/10 px-4 py-2 rounded-full border border-white/20"
            onPress={leaveChannel}
          >
            <Text className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Main Controls */}
        <View className="flex-row items-center justify-between px-2">
          
          {/* Speaking Indicator */}
          <View className="flex-1 justify-center">
             {isSomeoneTalking ? (
               <View className="flex-row items-center">
                 <View className="w-10 h-[2px] bg-[#4ADE80] mr-3" />
                 <Text className="text-[#4ADE80] font-bold uppercase tracking-widest text-xs">Transmitting</Text>
               </View>
             ) : (
               <View className="flex-row items-center">
                 <View className="w-10 h-[2px] bg-white/20 mr-3" />
                 <Text className="text-white/40 font-bold uppercase tracking-widest text-xs">Channel Quiet</Text>
               </View>
             )}
          </View>

          {/* Massive PTT / Mute Toggle */}
          <TouchableOpacity 
            className={`w-20 h-20 rounded-full items-center justify-center shadow-2xl border-4 ${
              isMuted ? 'bg-black/80 border-[#FF3B30]' : 'bg-[#4ADE80] border-[#4ADE80]'
            }`}
            onPress={toggleMute}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isMuted ? 'mic-off' : 'mic'} 
              size={32} 
              color={isMuted ? '#FF3B30' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}
