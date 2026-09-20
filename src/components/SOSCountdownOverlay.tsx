import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { useSOSStore } from '../store/useSOSStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SOSCountdownOverlay() {
  const { isSOSActive, sosSent, countdown, cancelSOS, clearSOSStatus } = useSOSStore();

  if (!isSOSActive && !sosSent) return null;

  return (
    <Modal
      transparent={true}
      visible={isSOSActive || sosSent}
      animationType="fade"
    >
      <View className="flex-1 bg-red-600 justify-between items-center pt-24 pb-12 px-6">
        
        {sosSent ? (
          <>
            <View className="flex-1 items-center justify-center w-full">
              <View className="bg-white/20 p-8 rounded-full mb-8">
                <Ionicons name="warning" size={120} color="#FFFFFF" />
              </View>
              <Text className="text-white text-5xl font-black text-center uppercase tracking-tighter leading-tight shadow-xl">
                Contacts{'\n'}Notified
              </Text>
              <Text className="text-white/80 text-lg font-bold text-center mt-6 uppercase px-4 leading-relaxed">
                Emergency services and your emergency contacts have been sent your exact GPS coordinates.
              </Text>
            </View>

            <TouchableOpacity 
              className="bg-black w-full py-6 rounded-3xl items-center shadow-2xl border-4 border-white/20"
              onPress={clearSOSStatus}
              activeOpacity={0.8}
            >
              <Text className="text-white text-2xl font-black uppercase tracking-widest">Dismiss</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="items-center">
              <Text className="text-white text-5xl font-black text-center uppercase tracking-tighter leading-tight">
                Crash{'\n'}Detected
              </Text>
              <Text className="text-white text-xl font-bold text-center mt-4 uppercase">
                Sending SOS in
              </Text>
            </View>

            <View className="items-center justify-center my-8">
              <View 
                className="rounded-full items-center justify-center border-8 border-white/30"
                style={{ width: width * 0.6, height: width * 0.6 }}
              >
                <Text className="text-white font-black" style={{ fontSize: 96 }}>
                  {countdown}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              className="bg-white w-full py-6 rounded-3xl items-center shadow-2xl border-4 border-black"
              onPress={cancelSOS}
              activeOpacity={0.8}
            >
              <Text className="text-red-600 text-3xl font-black uppercase">I'm OK - Cancel</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </Modal>
  );
}
