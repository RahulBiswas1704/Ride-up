import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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

  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isRouteFocused, setIsRouteFocused] = useState(false);

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
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/80">
        <BlurView intensity={40} tint="dark" className="rounded-t-[40px] border-t border-white/10 pt-8 px-6 h-[90%]">
          <View className="flex-row justify-between items-center mb-10">
            <Text className="text-white text-3xl font-light tracking-widest">PLAN RIDE</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-white/10 rounded-full border border-white/20">
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
            <View className="space-y-8">
              <View>
                <Text className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ml-1">Ride Title</Text>
                <View className={`border-b-2 ${isTitleFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput 
                    className="text-white font-medium text-lg px-1"
                    placeholder="e.g. Sunday Morning Canyons"
                    placeholderTextColor="#666666"
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setIsTitleFocused(true)}
                    onBlur={() => setIsTitleFocused(false)}
                  />
                </View>
              </View>

              <View>
                <Text className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ml-1">Date & Time</Text>
                <View className={`border-b-2 ${isDateFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput 
                    className="text-white font-medium text-lg px-1"
                    placeholder="e.g. 2024-12-01T08:00"
                    placeholderTextColor="#666666"
                    value={date}
                    onChangeText={setDate}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => setIsDateFocused(false)}
                  />
                </View>
              </View>

              <View>
                <Text className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ml-1">Meeting Point</Text>
                <View className={`border-b-2 ${isRouteFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors flex-row items-center`}>
                  <Ionicons name="navigate" size={20} color={isRouteFocused ? '#FF5E00' : '#666666'} className="mr-2" />
                  <TextInput 
                    className="text-white font-medium text-lg flex-1 px-1"
                    placeholder="e.g. Golden Gate Bridge"
                    placeholderTextColor="#666666"
                    value={routeLocation}
                    onChangeText={setRouteLocation}
                    onFocus={() => setIsRouteFocused(true)}
                    onBlur={() => setIsRouteFocused(false)}
                  />
                </View>
              </View>

              <View>
                <Text className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-4 ml-1">Pace / Difficulty</Text>
                <View className="flex-row space-x-3 mb-4">
                  {(['Casual', 'Spirited', 'Track'] as Difficulty[]).map((level) => {
                    const isSelected = difficulty === level;
                    return (
                      <TouchableOpacity 
                        key={level}
                        className={`flex-1 py-3 items-center rounded-2xl border-2 ${isSelected ? 'bg-white/10 border-[#FF5E00]' : 'bg-transparent border-white/10'}`}
                        onPress={() => setDifficulty(level)}
                      >
                        <Text className={`font-black text-[10px] uppercase tracking-widest ${isSelected ? 'text-[#FF5E00]' : 'text-white/60'}`}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className="bg-white w-full py-4 rounded-full items-center shadow-lg mt-8 border border-white/20"
              onPress={handleCreate}
              activeOpacity={0.8}
            >
              <Text className="text-black font-black text-sm uppercase tracking-[0.2em]">Post Ride</Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}
