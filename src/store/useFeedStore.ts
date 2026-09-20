import { create } from 'zustand';
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export type Difficulty = 'Casual' | 'Spirited' | 'Track';

export interface RideEvent {
  id?: string;
  title: string;
  date: string;
  routeLocation: string;
  difficulty: Difficulty;
  hostId: string;
  attendees: string[]; // Array of user IDs
  createdAt: number;
}

interface FeedState {
  rides: RideEvent[];
  isLoading: boolean;
  error: string | null;
  fetchRides: () => void;
  createRide: (ride: Omit<RideEvent, 'id' | 'createdAt'>) => Promise<void>;
  rsvpToRide: (rideId: string, userId: string) => Promise<void>;
}

// Mock user removed, using AuthStore instead

export const useFeedStore = create<FeedState>((set, get) => ({
  rides: [],
  isLoading: false,
  error: null,

  fetchRides: () => {
    set({ isLoading: true, error: null });
    
    // Set up a real-time listener for the rides collection
    const q = query(collection(db, 'rides'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides: RideEvent[] = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() } as RideEvent);
      });
      set({ rides, isLoading: false });
    }, (error) => {
      console.error("Error fetching rides: ", error);
      set({ error: error.message, isLoading: false });
    });

    // We don't return unsubscribe here since it's a global store, 
    // but in a real app we'd manage the subscription lifecycle carefully.
  },

  createRide: async (rideData) => {
    try {
      set({ isLoading: true, error: null });
      await addDoc(collection(db, 'rides'), {
        ...rideData,
        createdAt: Date.now(),
      });
      // fetchRides listener will automatically update the state
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error creating ride: ", error);
      set({ error: error.message, isLoading: false });
    }
  },

  rsvpToRide: async (rideId, userId) => {
    try {
      const rideRef = doc(db, 'rides', rideId);
      const ride = get().rides.find(r => r.id === rideId);
      
      if (!ride) return;

      const isAttending = ride.attendees.includes(userId);
      
      let newAttendees;
      if (isAttending) {
        newAttendees = ride.attendees.filter(id => id !== userId);
      } else {
        newAttendees = [...ride.attendees, userId];
      }

      await updateDoc(rideRef, {
        attendees: newAttendees
      });
      
      // The onSnapshot listener will automatically update the UI!
    } catch (error: any) {
      console.error("Error RSVPing to ride: ", error);
      set({ error: error.message });
    }
  }
}));
