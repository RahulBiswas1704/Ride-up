import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-textPrimary">Profile</Text>
      <Text className="text-textSecondary mt-2">User settings and info</Text>
    </View>
  );
}
