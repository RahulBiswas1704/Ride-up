import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen() {
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
    <View className="flex-1 bg-black">
      <ImageBackground 
        source={require('../../../assets/images/auth-bg.jpg')} 
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/60" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-6"
        >
          <View className="items-center mb-12">
            <Text className="text-white text-5xl font-light tracking-[0.2em] mb-2">RIDE-UP</Text>
            <View className="w-12 h-1 bg-[#FF5E00] rounded-full mb-4" />
            <Text className="text-[#8E8E93] text-xs font-bold tracking-widest uppercase">
              {isLogin ? 'Welcome Back' : 'Join the Pack'}
            </Text>
          </View>

          {error && (
            <View className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
              <Text className="text-red-500 font-bold text-center">{error}</Text>
            </View>
          )}

          <BlurView intensity={20} tint="dark" className="rounded-3xl p-6 border border-white/10 overflow-hidden">
            <View className="space-y-5">
              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Email</Text>
                <View className={`border-b-2 ${isEmailFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput
                    className="text-white font-medium text-lg px-1"
                    placeholder="rider@example.com"
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2 ml-1">Password</Text>
                <View className={`border-b-2 ${isPasswordFocused ? 'border-[#FF5E00]' : 'border-white/20'} pb-2 transition-colors`}>
                  <TextInput
                    className="text-white font-medium text-lg px-1"
                    placeholder="••••••••"
                    placeholderTextColor="#666666"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="bg-white w-full py-4 rounded-full items-center shadow-lg mt-10"
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-sm uppercase tracking-widest">
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
              <Text className="text-[#8E8E93] font-medium text-xs tracking-wider">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text className="text-[#FF5E00] font-bold">{isLogin ? 'Sign Up' : 'Log In'}</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
