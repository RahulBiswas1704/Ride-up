import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#FF5E00', // primary (Neon Orange)
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // surface
          borderTopColor: '#333333',
        },
        headerStyle: {
          backgroundColor: '#121212', // background
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: 'Ride Mode',
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
