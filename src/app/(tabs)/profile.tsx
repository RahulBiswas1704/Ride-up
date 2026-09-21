import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const renderSettingRow = (icon: keyof typeof Ionicons.glyphMap, title: string, isLast = false) => (
    <TouchableOpacity 
      className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-white/10' : ''}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center mr-4">
          <Ionicons name={icon} size={20} color="#FFFFFF" />
        </View>
        <Text className="text-white font-medium text-base tracking-wide">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666666" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Hero Header */}
      <View className="h-64 w-full relative">
        <ImageBackground 
          source={require('../../../assets/images/auth-bg.jpg')} 
          className="flex-1"
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
            className="absolute inset-0"
          />
        </ImageBackground>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Info Overlay */}
        <View className="px-6 -mt-24 mb-8">
          <View className="flex-row items-end mb-4">
            <View className="w-28 h-28 rounded-full bg-[#121212] border-4 border-black items-center justify-center shadow-2xl overflow-hidden">
              <View className="bg-[#FF5E00]/20 w-full h-full items-center justify-center">
                <Ionicons name="person" size={50} color="#FF5E00" />
              </View>
            </View>
            <TouchableOpacity className="ml-auto bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-2">
              <Text className="text-white font-bold text-xs uppercase tracking-widest">Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-white text-3xl font-light tracking-wider mb-1">
            Rider <Text className="font-black text-[#FF5E00]">One</Text>
          </Text>
          <Text className="text-[#8E8E93] text-sm font-bold tracking-widest uppercase">
            {user?.email || 'rider@example.com'}
          </Text>
        </View>

        {/* Rider Stats */}
        <View className="px-4 mb-8">
          <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-3 ml-2">Lifetime Stats</Text>
          <BlurView intensity={20} tint="dark" className="flex-row justify-between p-4 rounded-3xl border border-white/10 shadow-lg">
            <View className="flex-1 items-center border-r border-white/10">
              <Text className="text-[#FF5E00] text-2xl font-black mb-1">24</Text>
              <Text className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-widest">Rides</Text>
            </View>
            <View className="flex-1 items-center border-r border-white/10">
              <Text className="text-[#FF5E00] text-2xl font-black mb-1">1.2k</Text>
              <Text className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-widest">Miles</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#FF5E00] text-2xl font-black mb-1">135</Text>
              <Text className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-widest">Top MPH</Text>
            </View>
          </BlurView>
        </View>

        {/* Settings Menu */}
        <View className="px-4 mb-8">
          <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-3 ml-2">Preferences</Text>
          <BlurView intensity={20} tint="dark" className="px-5 py-2 rounded-3xl border border-white/10 shadow-lg">
            {renderSettingRow('person-outline', 'Account Details')}
            {renderSettingRow('notifications-outline', 'Notifications')}
            {renderSettingRow('lock-closed-outline', 'Privacy & Security')}
            {renderSettingRow('color-palette-outline', 'App Appearance')}
            {renderSettingRow('help-circle-outline', 'Help & Support', true)}
          </BlurView>
        </View>

        {/* Sign Out Button */}
        <View className="px-6 mt-4">
          <TouchableOpacity 
            className="bg-black py-4 rounded-full items-center border border-red-500/50 shadow-lg flex-row justify-center"
            onPress={logout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" className="mr-2" />
            <Text className="text-[#FF3B30] font-bold text-sm uppercase tracking-widest ml-2">
              Sign Out
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-[#8E8E93] text-[10px] mt-6 tracking-widest">
            APP VERSION 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
