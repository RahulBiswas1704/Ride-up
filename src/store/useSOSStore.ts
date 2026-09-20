import { create } from 'zustand';

type SOSState = {
  isSOSActive: boolean;
  countdown: number;
  intervalId: NodeJS.Timeout | null;
  triggerSOS: () => void;
  cancelSOS: () => void;
  executeSOSAlert: () => void;
};

export const useSOSStore = create<SOSState>((set, get) => ({
  isSOSActive: false,
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
    set({ isSOSActive: false, countdown: 15, intervalId: null });
  },

  executeSOSAlert: () => {
    console.log("CRITICAL: SOS PAYLOAD SENT TO BACKEND!");
    // Here we would typically make an API call to Supabase Edge Functions or Twilio
    
    // For now, reset the UI state so it doesn't stay stuck forever,
    // though in reality you might transition to an "SOS Sent" confirmation screen.
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    
    set({ isSOSActive: false, countdown: 15, intervalId: null });
  }
}));
