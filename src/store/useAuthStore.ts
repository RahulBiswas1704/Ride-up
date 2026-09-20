import { create } from 'zustand';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  initAuthListener: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false, // Prevents layout flashing while checking session
  isLoading: false,
  error: null,

  initAuthListener: () => {
    // This listener triggers automatically on startup and whenever user state changes
    onAuthStateChanged(auth, (user) => {
      set({ user, initialized: true });
    });
  },

  login: async (email, pass) => {
    try {
      set({ isLoading: true, error: null });
      await signInWithEmailAndPassword(auth, email, pass);
      set({ isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, pass) => {
    try {
      set({ isLoading: true, error: null });
      await createUserWithEmailAndPassword(auth, email, pass);
      set({ isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error(error);
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null })
}));
