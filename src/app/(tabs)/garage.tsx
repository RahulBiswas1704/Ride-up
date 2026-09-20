import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import { useGarageStore } from '../../store/useGarageStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // Assuming expo vector icons are available

export default function GarageScreen() {
  const { logs, isLoading, fetchLogs, addLog, deleteLog } = useGarageStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      // Adding dummy bike data since UI for bike selection isn't built yet
      motorcycle_make: 'Yamaha',
      motorcycle_model: 'MT-07',
    });
    
    // Reset and close
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
    <View className="bg-surface rounded-xl p-4 mb-4 flex-row justify-between items-center shadow-sm">
      <View className="flex-1 mr-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-bold text-textPrimary">{item.service_type}</Text>
          <Text className="text-primary font-bold">
            {item.cost ? `$${item.cost.toFixed(2)}` : 'N/A'}
          </Text>
        </View>
        <Text className="text-textSecondary text-sm mb-2">
          {new Date(item.service_date).toLocaleDateString()} • {item.motorcycle_make} {item.motorcycle_model}
        </Text>
        {item.description && (
          <Text className="text-textSecondary" numberOfLines={2}>{item.description}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)} className="p-2">
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-textPrimary">My Garage</Text>
        <TouchableOpacity 
          className="bg-primary rounded-full p-2 h-12 w-12 items-center justify-center shadow-lg"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
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
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Ionicons name="construct-outline" size={64} color="#A0A0A0" className="mb-4" />
              <Text className="text-textSecondary text-center text-lg mt-4 px-8">
                No maintenance logged yet. Keep your machine running smoothly.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Maintenance Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-surface rounded-t-3xl p-6 h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-textPrimary">Add Maintenance Log</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View className="mb-4">
                <Text className="text-textSecondary mb-2 font-semibold">Service Type</Text>
                <TextInput
                  className="bg-background text-textPrimary rounded-xl p-4 text-lg border border-gray-800"
                  placeholder="e.g. Oil Change, Tire Replacement"
                  placeholderTextColor="#A0A0A0"
                  value={serviceType}
                  onChangeText={setServiceType}
                />
              </View>

              <View className="mb-4">
                <Text className="text-textSecondary mb-2 font-semibold">Date</Text>
                <TouchableOpacity 
                  className="bg-background rounded-xl p-4 border border-gray-800 flex-row items-center justify-between"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-textPrimary text-lg">{date.toLocaleDateString()}</Text>
                  <Ionicons name="calendar-outline" size={24} color="#FF5E00" />
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

              <View className="mb-4">
                <Text className="text-textSecondary mb-2 font-semibold">Cost ($)</Text>
                <TextInput
                  className="bg-background text-textPrimary rounded-xl p-4 text-lg border border-gray-800"
                  placeholder="0.00"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="decimal-pad"
                  value={cost}
                  onChangeText={setCost}
                />
              </View>

              <View className="mb-6">
                <Text className="text-textSecondary mb-2 font-semibold">Notes</Text>
                <TextInput
                  className="bg-background text-textPrimary rounded-xl p-4 text-lg border border-gray-800"
                  placeholder="Any extra details..."
                  placeholderTextColor="#A0A0A0"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <TouchableOpacity 
                className="bg-primary rounded-xl p-4 items-center shadow-lg"
                onPress={handleSave}
              >
                <Text className="text-white font-bold text-xl">Save Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
