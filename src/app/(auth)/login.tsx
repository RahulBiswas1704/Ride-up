import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen() {
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    clearError();
    if (!email || !password) return;
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-10">
          <Ionicons name="speedometer" size={80} color="#E0FF00" />
          <Text className="text-white text-4xl font-black uppercase tracking-widest mt-4">Rydyt</Text>
          <Text className="text-textSecondary text-sm font-bold tracking-widest uppercase mt-2">
            {isLogin ? 'Welcome Back' : 'Join the Pack'}
          </Text>
        </View>

        {error && (
          <View className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <Text className="text-red-500 font-bold text-center">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <View>
            <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-2">Email</Text>
            <TextInput
              className="bg-surface text-white p-4 rounded-xl font-bold text-lg border border-white/10"
              placeholder="rider@example.com"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mt-4">
            <Text className="text-textSecondary text-xs uppercase tracking-widest font-bold mb-2">Password</Text>
            <TextInput
              className="bg-surface text-white p-4 rounded-xl font-bold text-lg border border-white/10"
              placeholder="••••••••"
              placeholderTextColor="#8E8E93"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary w-full py-5 rounded-2xl items-center shadow-lg mt-8"
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black font-black text-lg uppercase tracking-widest">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-6 items-center"
          onPress={() => {
            setIsLogin(!isLogin);
            clearError();
          }}
        >
          <Text className="text-textSecondary font-bold">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text className="text-primary">{isLogin ? 'Sign Up' : 'Log In'}</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
