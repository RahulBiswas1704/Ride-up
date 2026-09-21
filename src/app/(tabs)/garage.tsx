import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, SafeAreaView, Platform, ImageBackground } from 'react-native';
import { useGarageStore } from '../../store/useGarageStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function GarageScreen() {
  const { logs, isLoading, fetchLogs, addLog, deleteLog } = useGarageStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Focus states for premium inputs
  const [isServiceFocused, setIsServiceFocused] = useState(false);
  const [isCostFocused, setIsCostFocused] = useState(false);
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSave = () => {
    if (!serviceType) {
      Alert.alert('Validation Error', 'Please enter a service type.');
      return;
    }
    
    addLog({
      service_type: serviceType,
      cost: cost ? parseFloat(cost) : null,
      description: notes,
      service_date: date.toISOString(),
      motorcycle_make: 'Yamaha',
      motorcycle_model: 'MT-07',
    });
    
    setModalVisible(false);
    setServiceType('');
    setCost('');
    setNotes('');
    setDate(new Date());
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Log', 'Are you sure you want to delete this maintenance log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLog(id) }
    ]);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const renderItem = ({ item }: { item: any }) => (
    <BlurView intensity={20} tint="dark" className="rounded-2xl p-5 mb-4 border border-white/10 overflow-hidden flex-row justify-between items-center shadow-lg">
      <View className="flex-1 mr-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-bold text-white tracking-wider">{item.service_type}</Text>
          <Text className="text-[#FF5E00] font-black text-lg">
            {item.cost ? `$${item.cost.toFixed(2)}` : 'N/A'}
          </Text>
        </View>
        <Text className="text-[#8E8E93] text-xs uppercase tracking-widest font-bold mb-3">
          {new Date(item.service_date).toLocaleDateString()}
        </Text>
        {item.description && (
          <Text className="text-white/70 text-sm" numberOfLines={2}>{item.description}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)} className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Hero Section */}
      <View className="h-[40%] w-full">
        <ImageBackground 
          source={require('../../../assets/images/garage-hero.jpg')} 
          className="flex-1 justify-end"
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
            className="absolute inset-0"
          />
          <SafeAreaView>
            <View className="px-6 pb-6">
              <Text className="text-[#8E8E93] text-xs font-bold tracking-[0.3em] uppercase mb-1">Active Ride</Text>
              <Text className="text-white text-4xl font-light tracking-widest mb-1">YAMAHA</Text>
              <Text className="text-[#FF5E00] text-5xl font-black tracking-tighter">MT-07</Text>
              <View className="flex-row mt-4 space-x-4">
                <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Text className="text-white text-xs font-bold">12,450 MI</Text>
                </View>
                <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Text className="text-white text-xs font-bold">689 CC</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      {/* Maintenance Logs List */}
      <View className="flex-1 px-4 pt-2">
        <View className="flex-row items-center justify-between mb-4 px-2">
          <Text className="text-white/60 text-sm font-bold uppercase tracking-widest">Service History</Text>
        </View>

        {isLoading && logs.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF5E00" />
          </View>
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20 opacity-50">
                <Ionicons name="construct-outline" size={64} color="#8E8E93" className="mb-4" />
                <Text className="text-[#8E8E93] text-center text-sm uppercase tracking-widest font-bold mt-4 px-8">
                  No maintenance logged.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#FF5E00] rounded-full h-16 w-16 items-center justify-center shadow-[0_0_20px_rgba(255,94,0,0.5)] border border-white/20"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Maintenance Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <BlurView intensity={30} tint="dark" className="rounded-t-3xl border-t border-white/10 p-6 pt-8 h-[85%]">
            <View className="flex-row justify-between items-center mb-10">
              <Text className="text-3xl font-light text-white tracking-widest">ADD LOG</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-white/10 p-2 rounded-full">
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View className="space-y-6">
              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Service Type</Text>
                <View className={`border-b-2 ${isServiceFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput
                    className="text-white font-medium text-lg px-1"
                    placeholder="e.g. Oil Change, Tires"
                    placeholderTextColor="#666666"
                    value={serviceType}
                    onChangeText={setServiceType}
                    onFocus={() => setIsServiceFocused(true)}
                    onBlur={() => setIsServiceFocused(false)}
                  />
                </View>
              </View>

              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Date</Text>
                <TouchableOpacity 
                  className="border-b-2 border-white/20 pb-2 flex-row items-center justify-between px-1 py-1"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-white font-medium text-lg">{date.toLocaleDateString()}</Text>
                  <Ionicons name="calendar-outline" size={22} color="#FF5E00" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </View>

              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Cost ($)</Text>
                <View className={`border-b-2 ${isCostFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors flex-row items-center`}>
                  <Text className="text-[#FF5E00] font-bold text-lg mr-2">$</Text>
                  <TextInput
                    className="text-white font-medium text-lg flex-1 px-1"
                    placeholder="0.00"
                    placeholderTextColor="#666666"
                    keyboardType="decimal-pad"
                    value={cost}
                    onChangeText={setCost}
                    onFocus={() => setIsCostFocused(true)}
                    onBlur={() => setIsCostFocused(false)}
                  />
                </View>
              </View>

              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Notes</Text>
                <View className={`border-b-2 ${isNotesFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput
                    className="text-white font-medium text-lg px-1"
                    placeholder="Any extra details..."
                    placeholderTextColor="#666666"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                    onFocus={() => setIsNotesFocused(true)}
                    onBlur={() => setIsNotesFocused(false)}
                  />
                </View>
              </View>

              <TouchableOpacity 
                className="bg-white rounded-full py-4 items-center shadow-lg mt-8 border border-white/20"
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text className="text-black font-bold text-sm uppercase tracking-widest">Save Maintenance Log</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}
