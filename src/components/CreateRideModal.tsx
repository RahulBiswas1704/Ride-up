import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedStore, Difficulty } from '../store/useFeedStore';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CreateRideModal({ visible, onClose }: Props) {
  const { createRide } = useFeedStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [routeLocation, setRouteLocation] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Casual');

  const handleCreate = async () => {
    if (!title || !date || !routeLocation) {
      alert("Please fill in all fields.");
      return;
    }

    if (!user) return;
    
    await createRide({
      title,
      date,
      routeLocation,
      difficulty,
      hostId: user.uid,
      attendees: [user.uid], // Host is automatically attending
    });

    // Reset and close
    setTitle('');
    setDate('');
    setRouteLocation('');
    setDifficulty('Casual');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background pt-10 px-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-white text-2xl font-black uppercase tracking-wider">Plan a Ride</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-surface rounded-full">
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-2">Ride Title</Text>
          <TextInput 
            className="bg-surface text-white p-4 rounded-xl mb-6 font-bold text-lg border border-white/10"
            placeholder="e.g. Sunday Morning Canyons"
            placeholderTextColor="#8E8E93"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-2">Date & Time</Text>
          <TextInput 
            className="bg-surface text-white p-4 rounded-xl mb-6 font-bold text-lg border border-white/10"
            placeholder="e.g. 2024-12-01T08:00"
            placeholderTextColor="#8E8E93"
            value={date}
            onChangeText={setDate}
          />

          <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-2">Meeting Point / Route</Text>
          <TextInput 
            className="bg-surface text-white p-4 rounded-xl mb-6 font-bold text-lg border border-white/10"
            placeholder="e.g. Golden Gate Bridge"
            placeholderTextColor="#8E8E93"
            value={routeLocation}
            onChangeText={setRouteLocation}
          />

          <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-4">Difficulty Level</Text>
          <View className="flex-row space-x-3 mb-10">
            {(['Casual', 'Spirited', 'Track'] as Difficulty[]).map((level) => {
              const isSelected = difficulty === level;
              return (
                <TouchableOpacity 
                  key={level}
                  className={`flex-1 py-3 items-center rounded-xl border-2 ${isSelected ? 'bg-primary border-primary' : 'bg-surface border-white/10'}`}
                  onPress={() => setDifficulty(level)}
                >
                  <Text className={`font-bold text-xs uppercase tracking-widest ${isSelected ? 'text-black' : 'text-white'}`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            className="bg-primary w-full py-5 rounded-2xl items-center shadow-lg mb-10"
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <Text className="text-black font-black text-lg uppercase tracking-widest">Post Ride</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
