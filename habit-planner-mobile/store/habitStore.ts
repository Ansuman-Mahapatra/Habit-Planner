import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface HabitState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  toggleTheme: () => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  theme: 'dark', // Default theme as per design

  login: async (user, token) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // Set default user as Ansuman
        const defaultUser: User = {
          _id: 'default-user',
          name: 'Ansuman',
          email: 'ansuman@local',
          token: 'local-token'
        };
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
        set({ user: defaultUser, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load user', error);
      // Even on error, set default user
      const defaultUser: User = {
        _id: 'default-user',
        name: 'Ansuman',
        email: 'ansuman@local',
        token: 'local-token'
      };
      set({ user: defaultUser, isAuthenticated: true, isLoading: false });
    }
  },

  updateUserName: async (name: string) => {
    const currentUser = useHabitStore.getState().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, name };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
