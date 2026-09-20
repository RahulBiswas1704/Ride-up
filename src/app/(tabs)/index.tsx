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
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-10 pb-4">
        <Text className="text-white text-3xl font-black uppercase tracking-widest">Community</Text>
        <Text className="text-textSecondary text-sm font-bold tracking-wider mt-1">Upcoming Rides</Text>
      </View>

      {isLoading && rides.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E0FF00" />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          renderItem={({ item }) => <RideEventCard ride={item} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Ionicons name="map-outline" size={48} color="#2C2C2E" />
              <Text className="text-textSecondary font-bold mt-4 text-center">No upcoming rides.{'\n'}Be the first to plan one!</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-xl border-4 border-black z-10"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>

      <CreateRideModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
}
