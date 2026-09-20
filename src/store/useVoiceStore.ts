import { create } from 'zustand';

type VoiceState = {
  channelId: string | null;
  isConnected: boolean;
  isMuted: boolean;
  speakingUids: number[];
  connectedRidersCount: number;

  joinChannel: (channelName: string) => void;
  leaveChannel: () => void;
  toggleMute: () => void;
  setSpeakingUids: (uids: number[]) => void;
  setConnectedRidersCount: (count: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsConnected: (connected: boolean) => void;
};

export const useVoiceStore = create<VoiceState>((set, get) => ({
  channelId: null,
  isConnected: false,
  isMuted: false,
  speakingUids: [],
  connectedRidersCount: 0,

  joinChannel: (channelName: string) => {
    // Note: The actual Agora SDK logic is handled in the useAgoraVoice hook.
    // This action just updates the desired state.
    set({ channelId: channelName });
  },

  leaveChannel: () => {
    set({ 
      channelId: null, 
      isConnected: false, 
      isMuted: false, 
      speakingUids: [], 
      connectedRidersCount: 0 
    });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  setSpeakingUids: (uids: number[]) => {
    set({ speakingUids: uids });
  },

  setConnectedRidersCount: (count: number) => {
    set({ connectedRidersCount: count });
  },

  setIsMuted: (muted: boolean) => {
    set({ isMuted: muted });
  },

  setIsConnected: (connected: boolean) => {
    set({ isConnected: connected });
  }
}));
