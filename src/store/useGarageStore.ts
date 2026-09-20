import { create } from 'zustand';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Alert } from 'react-native';

export type GarageLog = {
  id: string;
  user_id: string;
  motorcycle_make: string;
  motorcycle_model: string;
  motorcycle_year: number;
  service_type: string;
  description: string | null;
  service_date: string;
  odometer: number | null;
  cost: number | null;
  receipt_image_url: string | null;
  created_at: string;
};

type GarageState = {
  logs: GarageLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  addLog: (log: Partial<GarageLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
};

// DUMMY_USER_ID for testing inserts before full auth is setup
const DUMMY_USER_ID = 'test-firebase-user-123'; 

export const useGarageStore = create<GarageState>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(collection(db, 'garage_logs'), orderBy('service_date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedLogs: GarageLog[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLogs.push({ id: doc.id, ...doc.data() } as GarageLog);
      });
      
      set({ logs: fetchedLogs });
    } catch (error: any) {
      console.error('Error fetching garage logs:', error);
      set({ error: error.message });
      Alert.alert('Error', 'Failed to load maintenance logs.');
    } finally {
      set({ isLoading: false });
    }
  },

  addLog: async (log) => {
    set({ isLoading: true, error: null });
    try {
      const newLog = {
        ...log,
        user_id: DUMMY_USER_ID,
        motorcycle_make: log.motorcycle_make || 'Yamaha',
        motorcycle_model: log.motorcycle_model || 'MT-07',
        created_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'garage_logs'), newLog);

      // Update local state if insert successful
      const addedLog = { id: docRef.id, ...newLog } as GarageLog;
      set({ logs: [addedLog, ...get().logs] });
    } catch (error: any) {
      console.error('Error adding garage log:', error);
      set({ error: error.message });
      Alert.alert('Error', 'Failed to save maintenance log.');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'garage_logs', id));
      set({ logs: get().logs.filter((log) => log.id !== id) });
    } catch (error: any) {
      console.error('Error deleting garage log:', error);
      set({ error: error.message });
      Alert.alert('Error', 'Failed to delete log.');
    } finally {
      set({ isLoading: false });
    }
  },
}));
