import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      case 'Casual': return '#00FF66'; // Neon Green
      case 'Spirited': return '#E0FF00'; // Electric Yellow
      case 'Track': return '#FF5E00'; // Neon Orange
      default: return '#00FF66';
    }
  };

  const handleRSVP = () => {
    if (userId) rsvpToRide(ride.id!, userId);
  };

  return (
    <View 
      className="bg-surface/80 rounded-2xl p-5 mb-4 border shadow-xl"
      style={{ borderColor: getDifficultyColor(), borderWidth: 1 }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-2">
          <Text className="text-white text-xl font-black uppercase tracking-wider">{ride.title}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
            <Text className="text-textSecondary text-xs ml-1">{new Date(ride.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="navigate-circle-outline" size={14} color="#8E8E93" />
            <Text className="text-textSecondary text-xs ml-1">{ride.routeLocation}</Text>
          </View>
        </View>
        
        <View 
          className="px-3 py-1 rounded-full items-center justify-center border border-white/20"
          style={{ backgroundColor: `${getDifficultyColor()}20` }}
        >
          <Text style={{ color: getDifficultyColor() }} className="text-[10px] font-bold uppercase tracking-widest">{ride.difficulty}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/10">
        <View className="flex-row items-center">
          <Text className="text-white font-bold text-sm mr-2">{ride.attendees.length}</Text>
          <Text className="text-textSecondary text-xs uppercase tracking-widest">Riders</Text>
        </View>

        <TouchableOpacity 
          className={`px-6 py-2 rounded-full border-2 ${isAttending ? 'bg-transparent' : 'bg-primary'}`}
          style={{ borderColor: isAttending ? '#8E8E93' : '#E0FF00' }}
          onPress={handleRSVP}
          activeOpacity={0.8}
        >
          <Text className={`font-bold text-xs uppercase tracking-widest ${isAttending ? 'text-textSecondary' : 'text-black'}`}>
            {isAttending ? 'Leave' : 'Join Ride'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
