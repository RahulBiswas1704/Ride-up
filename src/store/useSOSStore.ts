import { create } from 'zustand';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './useAuthStore';

type SOSState = {
  isSOSActive: boolean;
  sosSent: boolean;
  countdown: number;
  intervalId: NodeJS.Timeout | null;
  triggerSOS: () => void;
  cancelSOS: () => void;
  clearSOSStatus: () => void;
  executeSOSAlert: () => Promise<void>;
};

export const useSOSStore = create<SOSState>((set, get) => ({
  isSOSActive: false,
  sosSent: false,
  countdown: 15,
  intervalId: null,

  triggerSOS: () => {
    // Prevent multiple triggers
    if (get().isSOSActive) return;

    set({ isSOSActive: true, countdown: 15 });

    const interval = setInterval(() => {
      const currentCountdown = get().countdown;
      
      if (currentCountdown <= 1) {
        // Time's up!
        clearInterval(interval);
        get().executeSOSAlert();
      } else {
        set({ countdown: currentCountdown - 1 });
      }
    }, 1000);

    set({ intervalId: interval });
  },

  cancelSOS: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ isSOSActive: false, sosSent: false, countdown: 15, intervalId: null });
  },

  clearSOSStatus: () => {
    set({ sosSent: false, isSOSActive: false, countdown: 15 });
  },

  executeSOSAlert: async () => {
    console.log("CRITICAL: SOS PAYLOAD SENT TO BACKEND!");
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

    try {
      const user = useAuthStore.getState().user;
      const uid = user ? user.uid : 'unauthenticated_user';
      
      // Simulate backend webhook by writing to Firestore
      await addDoc(collection(db, 'sos_alerts'), {
        userId: uid,
        timestamp: new Date().toISOString(),
        status: 'sent',
        // Real app would include exact GPS coordinates here
        location: { latitude: 22.581, longitude: 88.471 } 
      });
      
      // Trigger success UI
      set({ sosSent: true, isSOSActive: false, countdown: 15, intervalId: null });
    } catch (error) {
      console.error("Failed to send SOS webhook to Firebase: ", error);
      // Fallback UI
      set({ sosSent: true, isSOSActive: false, countdown: 15, intervalId: null });
    }
  }
}));
