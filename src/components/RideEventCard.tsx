import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { RideEvent, useFeedStore } from '../store/useFeedStore';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  ride: RideEvent;
}

export default function RideEventCard({ ride }: Props) {
  const { rsvpToRide } = useFeedStore();
  const { user } = useAuthStore();
  const userId = user?.uid || '';
  const isAttending = ride.attendees.includes(userId);

  const getDifficultyColor = () => {
    switch (ride.difficulty) {
      case 'Casual': return '#4ADE80'; // Mint Green
      case 'Spirited': return '#FACC15'; // Golden Yellow
      case 'Track': return '#FF5E00'; // Brand Orange
      default: return '#4ADE80';
    }
  };

  const handleRSVP = () => {
    if (userId) rsvpToRide(ride.id!, userId);
  };

  return (
    <BlurView 
      intensity={20} 
      tint="dark" 
      className="rounded-3xl p-5 mb-5 border border-white/10 shadow-lg overflow-hidden"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-4">
          <Text className="text-white text-xl font-light tracking-wide mb-2">{ride.title}</Text>
          <View className="flex-row items-center mb-1">
            <Ionicons name="calendar-outline" size={14} color="#FF5E00" />
            <Text className="text-[#8E8E93] text-xs font-bold tracking-widest ml-2 uppercase">
              {new Date(ride.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="navigate-circle-outline" size={14} color="#FF5E00" />
            <Text className="text-[#8E8E93] text-xs font-bold tracking-widest ml-2 uppercase" numberOfLines={1}>
              {ride.routeLocation}
            </Text>
          </View>
        </View>
        
        <View 
          className="px-3 py-1.5 rounded-full items-center justify-center border"
          style={{ backgroundColor: `${getDifficultyColor()}15`, borderColor: `${getDifficultyColor()}30` }}
        >
          <Text style={{ color: getDifficultyColor() }} className="text-[10px] font-black uppercase tracking-widest">
            {ride.difficulty}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/10">
        <View className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Ionicons name="people" size={14} color="#FFFFFF" className="mr-1" />
          <Text className="text-white font-bold text-xs ml-1">{ride.attendees.length}</Text>
        </View>

        <TouchableOpacity 
          className={`px-6 py-2.5 rounded-full border-2 shadow-lg flex-row items-center ${isAttending ? 'bg-black/50 border-white/20' : 'bg-white border-white'}`}
          onPress={handleRSVP}
          activeOpacity={0.8}
        >
          {isAttending && <Ionicons name="checkmark" size={16} color="#FFFFFF" className="mr-1" />}
          <Text className={`font-black text-[10px] uppercase tracking-widest ${isAttending ? 'text-white' : 'text-black'}`}>
            {isAttending ? 'Attending' : 'Join Ride'}
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}
