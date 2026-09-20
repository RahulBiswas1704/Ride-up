import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="person-circle" size={120} color="#E0FF00" />
        
        <Text className="text-white text-2xl font-black uppercase tracking-widest mt-6">
          Rider Profile
        </Text>
        
        <Text className="text-textSecondary text-lg font-bold mt-2 mb-10">
          {user?.email || 'rider@example.com'}
        </Text>

        <TouchableOpacity 
          className="bg-red-500/20 w-full py-4 rounded-2xl items-center border border-red-500"
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text className="text-red-500 font-black text-lg uppercase tracking-widest">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
