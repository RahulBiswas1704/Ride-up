import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedStore } from '../../store/useFeedStore';
import RideEventCard from '../../components/RideEventCard';
import CreateRideModal from '../../components/CreateRideModal';

export default function DashboardScreen() {
  const { rides, isLoading, fetchRides } = useFeedStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 pt-10 pb-6 border-b border-white/5">
        <Text className="text-[#8E8E93] text-xs font-bold tracking-[0.3em] uppercase mb-1">Ride-Up Club</Text>
        <Text className="text-white text-4xl font-light tracking-widest">COMMUNITY</Text>
      </View>

      {isLoading && rides.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF5E00" />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RideEventCard ride={item} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-24 opacity-50">
              <Ionicons name="map-outline" size={64} color="#8E8E93" />
              <Text className="text-[#8E8E93] font-bold mt-6 text-center tracking-widest uppercase text-xs">
                No upcoming rides.{'\n'}Be the first to plan one!
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#FF5E00] rounded-full h-16 w-16 items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.5)] border border-white/20 z-10"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <CreateRideModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
}
